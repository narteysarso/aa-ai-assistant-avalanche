import { ChatOpenAI, } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { BufferMemory } from "langchain/memory";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { RunnableSequence } from "@langchain/core/runnables";

import * as dotenv from "dotenv";
import { randomUUID } from "crypto";

dotenv.config();

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 1000,
    verbose: true
});


const prompt = ChatPromptTemplate.fromTemplate(`

You are an assistant. You extract relevant information from {input} and categories them into any of the following groups

Here are the groups and the data that can be extracted for each:

1. account_activity - Transaction history data : 
    extractable data :
    ------------------
        - address 
        - chain name or network as chain_name 
        - size 

2. transaction_data - a transfer tokens from on account to another over a network or multiple chains or networks : 
    extractable data :
    ------------------
        - sender address as sender
        - recipient address as recipient 
        - amount of tokens as amount, token name as token
        - sender chain name or network as senerChainName
        - recipient chain name or network as recipientChainName

3. token_balances - number of tokens of an account and their balances:
    extractable data :
    ------------------
        - address, 
        - list of chain names or networks as chain_names
        - size

4. nft_tokens - an account nft tokens and their balances :
    extractable data :
    ------------------
        - address, 
        - list of chain names or networks as chain_names
        - size - default is 10
        - list of nfts as nfts

5. token_transfers - history of account token transfers :
    extractable data :
    ------------------
        - account address as address
        - list of chain names or networks as chain_names 
        - token contract address as contract_address

6. nft_collection - an nft collections list 
    extractable data :
    ------------------
        - chain name or network as chain_name, 
        - collection address as collection_address

7. nft_detail - an nft token detail : 
    extractable data :
    ------------------
        - nft token or collection address as collection_address, 
        - chain name or network as chain_name, 
        - token id as tokenID


Here is a list of supported chain names or networks :
    - eth-mainnet
    - matic-mainnet
    - bsc-mainnet
    - avalanche-mainnet
    - avalanche-testnet
    - optimism-mainnet

Replace user chain name with the closest supported chain name. DO NOT ASSUME missing data, ALWAYS set them empty.

The user input can only be transaction history, token balances, or transaction data, nft balances, token transfer history, nft collection, or nft details and not two or more categories or groups.

History: {history}

use the following Formatting Instructions: {format_instructions}
`);

const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
        data: z.object({
            name: z.string().describe("category name"),
            args: z.array(z.object({
                name: z.string().describe("field name"),
                arg: z.any().describe("extracted data")
            })).describe("list of extracted information"),
            content: z.string().describe("summary statment or warm comments")
        }).describe("information category"),
        queries: z.array(
            z.object({
                name: z.string().describe("name or title of the query"),
                args: z.array(z.any()).describe("arguments that can be added to the query")
            })
        ).describe("next set of enquires the user can send to ai system")
    })
)

function createChain(thread_id: string) {
    const upstashChatHistory = new UpstashRedisChatMessageHistory({
        sessionId: thread_id,
        config: {
            url: process.env.UPSTASH_REDIS_REST_URL as string,
            token: process.env.UPSTASH_REDIS_REST_TOKEN as string
        }
    });

    const memory = new BufferMemory({
        memoryKey: "history",
        chatHistory: upstashChatHistory
    });

    // console.log(outputParser.getFormatInstructions());

    const chain = RunnableSequence.from([
        {
            input: (initialInput) => initialInput.input,
            format_instructions: (initialInput) => initialInput.format_instructions,
            memory: () => memory.loadMemoryVariables({})
        },
        {
            input: (prevInput) => prevInput.input,
            format_instructions: (prevInput) => prevInput.format_instructions,
            history: (prevInput) => prevInput.memory.history
        },
        prompt,
        model,
        outputParser
    ]);

    return { chain, memory };
}

const invoke = async (input: string, thread_id: string) => {
    const { chain, memory } = createChain(thread_id);
    const response = await chain.invoke({ input, format_instructions: outputParser.getFormatInstructions() })

    await memory.saveContext({ input }, { output: response });
    
    return response;
}

const getThread = (thread_id: string): UpstashRedisChatMessageHistory => {
    const upstashChatHistory = new UpstashRedisChatMessageHistory({
        sessionId: thread_id,
        config: {
            url: process.env.UPSTASH_REDIS_REST_URL as string,
            token: process.env.UPSTASH_REDIS_REST_TOKEN as string
        }
    });

    return upstashChatHistory;
}
const getMessages = async (thread_id: string) => {
    const thread = getThread(thread_id);
    const memory = new BufferMemory({
        memoryKey: "history",
        chatHistory: thread
    });
    const messages = await memory.loadMemoryVariables({});
    
    return messages;
}

export default Object.freeze({
    invoke,
    getThread,
    getMessages
});

/**
 * 

// Get user input
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = () => {
    rl.question("User: ", async (input) => {
      // input sanity check
        if(input.toLocaleLowerCase() === "exit"){
            rl.close();
            return;
        }
        // const response = await chain.invoke({
        //     input,
        //     format_instructions: outputParser.getFormatInstructions()
        // })

        // send 2 avax to 0xCb90C09494d399Bc2AF8b0343621639CF83B910B on avalanche
        console.log(input);
        const response = await chain.invoke({input, format_instructions: outputParser.getFormatInstructions(), memoryKey: ""})

        await memory.saveContext({input}, {output: response});
        
        console.log("Agent: ", response?.data);

        askQuestion();
    });
}

askQuestion();

 */

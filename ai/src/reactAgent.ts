import { ChatOpenAI, } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { BufferMemory } from "langchain/memory";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { RunnableSequence } from "@langchain/core/runnables";

import * as dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    verbose: true
});


const prompt = ChatPromptTemplate.fromTemplate(`

You are an assistant. You help users interact with the blockchain by storing,retrieving, providing, and extracting information for the user.
Based on user input context and groups context, you can extract relevant information from the input and categories them into any of the following groups whenever applicable.

Here are the groups, the context, and the data that can be extracted for each - the order is NOT important:
- store account details: 
    context: save user account details including address, and chain name. user account details is used subsequent chats.
    extractable data :
    ------------------
        - address 
        - chain name or network as chain_name   

- nft_balances:
    context: a list of nft tokens in an account/address and their balances
    extractable data :
    ------------------
        - address, 
        - list of chain names or networks as chain_names
        - size default is 10
        - list of nfts as nfts

- token_balances:
    context: a list of tokens in an account/address and their balances. If chain names is not provided set it empty
    extractable data :
    ------------------
            - address, 
            - list of chain names as chain_names.
            - size

- transaction_data:
    context: transfer tokens from one account to another over a network or multiple chains or networks
    extractable data :
    ------------------
        - address of sender of the token as sender
        - address of recipient of the token as recipient 
        - amount of tokens to send as amount
        - name of token being sent as token
        - address of token being sent or contract address as contract_address
        - sender chain name or network as senerChainName
        - recipient chain name or network as recipientChainName
            
- account_activity:
    context: records of past executed transactions
    extractable data :
    ------------------
        - address 
        - chain name or network as chain_name 

- token_transfers:
    context: history/list of tokens transfered to and from account:
    extractable data :
    ------------------
        - account address as address
        - chain name or network as chain_name
        - contract address as contract_address

- nft_collection: 
    context: an nft collections list 
    extractable data :
    ------------------
        - chain name or network as chain_name, 
        - collection address as collection_address

- nft_detail:
    context: an nft token detail 
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

Replace chain names or networks in user input with the closest supported chain names. 

DO NOT assume or halucinate missing data, ALWAYS set them empty.

Each user input can only fall in one group ONLY . 
Thus transaction history, token balances, or transaction data, nft balances, token transfer history, nft collection, or nft details and not two or more categories or groups.

use the following Formatting Instructions: {format_instructions}

chat_history: {history}

{input}

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

    await memory.saveContext({ input }, { output: JSON.stringify(response)});
    
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

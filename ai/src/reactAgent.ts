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

You are an assistant. You can extract relevant information and categories them into on of three groups based on the users {input}

History: {history}

The groups are:
1. Transaction history data : extract address, chain name or network as chainName, and size 
2. transfer transaction data: extract sender address as sender, recipient address as recipient, amount of tokens as amount, token name as token, and sender chain name or network as senerChainName, recipient chain name or network as recipientChainName
3. account token balances: extract address, list of chain names or networks as chainNames, size, list of tokens as tokens
4. account nft balances: extract address, list of chain names or networks as chainNames, size, list of nfts as nfts
5. transfer history of token: extract account address as address, list of chain names or networks as chainNames, token contract address as tokenAddress
6. nft collections list: chain name or network as chainName, collection address as collectionAddress
7. an nft token detail: extract nft token or collection address as collectionAddress, chain name or network as chainName, token id as tokenID

The user input can only be transaction history, account token balances, or transaction data and not two or more categories

use the following Formatting Instructions: {format_instructions}
`);

const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
        data: z.object({
            name: z.string().describe("category name"),
            args: z.array(z.object({
                name: z.string().describe("field name"),
                arg: z.any().describe("extracted data")
            })).describe("list of extracted information")
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
            memory: () => memory.loadMemoryVariables()
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
    return await thread.getMessages();
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

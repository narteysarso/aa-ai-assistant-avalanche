import { CovalentClient } from "@covalenthq/client-sdk";
import { formatUnit } from "../utils";

const client = new CovalentClient(process.env.REACT_APP_COVALENT_API_KEY);

const chains = [
    "eth-mainnet",
    "matic-mainnet",
    "bsc-mainnet",
    "avalanche-mainnet",
    "avalanche-tesnet",
    "optimism-mainnet",
];

export const getAccountBalance = async({chain = chains, account = "0x",nft = true}) => {
    const resp = await client.BalanceService.getTokenBalancesForWalletAddress(chain, account, {nft});
    if(resp.error) throw new Error(resp.error_message);
    return resp.data;
}

export const getTokenTransfers = async ({chain = chains, account = "0x", pageSize = 10, pageNumber = 1}) => {
    try {
        for await (const resp of client.BalanceService.getErc20TransfersForWalletAddress(chain, account, {pageSize, pageNumber})) {
            console.log(resp);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getNativeTokenBalance = async({chain, account}) => {
    const resp = await client.BalanceService.getNativeTokenBalance(chain, account);
    if(resp.error) throw new Error(resp.error_message);

    const token = resp.data.items[0];
    if(!token) throw new Error("Token not found");

    const balance =  formatUnit(token.balance, token.contract_decimals);

    return balance;
}
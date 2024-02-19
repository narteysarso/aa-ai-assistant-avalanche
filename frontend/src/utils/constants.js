import { accountActivity, getTokensUI, nftCollectionUi, nftDetailUi, nftTokensUI, tokenTransferUI } from "../service/goldrush"
import { sendTransaction } from "../service/particle"

export const ROLES = {
    assistant: {
        name: "assistant",
        imgsrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp"
    },
    user: {
        name: "user",
        imgsrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
    },
    ai: {
        name: "assistant",
        imgsrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp"
    },
    human: {
        name: "user",
        imgsrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
    }
}

export const MESSAGE_STATUSES = ["failed", "cancelled", "expired", "completed"]

export const UIs = {
    "token_balances": getTokensUI,
    "account_activity": accountActivity,
    "nft_tokens": nftTokensUI,
    "token_transfers": tokenTransferUI,
    "nft_collection": nftCollectionUi,
    "nft_detail": nftDetailUi,
    "transaction_data": sendTransaction
}

export const dummyMessages = [
    {
        imgsrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp",
        owner: "assistant",
        message: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna
            aliqua`,
        timestamp: Date.now(),
    },
    {
        imgsrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp",
        owner: "user",
        message: ` Sed ut perspiciatis unde omnis iste natus error sit
            voluptatem accusantium doloremque laudantium.`,
        timestamp: Date.now(),
    },
    {
        imgsrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp",
        owner: "assistant",
        message: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna
            aliqua.`,
        timestamp: Date.now(),
    }
]


export const TOKENADDRESS = {
   "AVAX": {
    addresses: {
        "eth-mainnet":"",
        "matic-mainnet":"",
        "bsc-mainnet":"",
        "avalanche-mainnet":"",
        "avalanche-tesnet":"",
        "optimism-mainnet":"",
    },
    decimals: "18",
   },
   "ETH": {
    addresses: {
        "eth-mainnet":"",
        "matic-mainnet":"",
        "bsc-mainnet":"",
        "avalanche-mainnet":"",
        "avalanche-tesnet":"",
        "optimism-mainnet":"",
    },
    decimals: "18",
   },
   "MATIC": {
    addresses: {
        "eth-mainnet":"",
        "matic-mainnet":"",
        "bsc-mainnet":"",
        "avalanche-mainnet":"",
        "avalanche-tesnet":"",
        "optimism-mainnet":"",
    },
    decimals: "18",
   },
   "WBTC": {
    addresses: {
        "eth-mainnet":"",
        "matic-mainnet":"",
        "bsc-mainnet":"",
        "avalanche-mainnet":"",
        "avalanche-tesnet":"",
        "optimism-mainnet":"",
    },
    decimals: "18",
   },
   "WMatic": {
    addresses: {
        "eth-mainnet":"",
        "matic-mainnet":"",
        "bsc-mainnet":"",
        "avalanche-mainnet":"",
        "avalanche-tesnet":"",
        "optimism-mainnet":"",
    },
    decimals: "18",
   },
   "ETH": {
    addresses: {
        "eth-mainnet":"",
        "matic-mainnet":"",
        "bsc-mainnet":"",
        "avalanche-mainnet":"",
        "avalanche-tesnet":"",
        "optimism-mainnet":"",
    },
    decimals: "18",
   },
   "ETH": {
    addresses: {
        "eth-mainnet":"",
        "matic-mainnet":"",
        "bsc-mainnet":"",
        "avalanche-mainnet":"",
        "avalanche-tesnet":"",
        "optimism-mainnet":"",
    },
    decimals: "18",
   },
}

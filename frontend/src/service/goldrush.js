import { AddressActivityListView, NFTCollectionTokenListView, NFTDetailView, NFTWalletTokenListView, TokenBalancesListView, TokenTransfersListView } from "@covalenthq/goldrush-kit"

export const getTokensUI = ({ chain_names = [
    "eth-mainnet",
    "matic-mainnet",
    "bsc-mainnet",
    "avalanche-mainnet",
    "avalanche-testnet",
    "optimism-mainnet",
], address, hide_small_balances = false }) => {
    return (
        <TokenBalancesListView
            chain_names={chain_names}
            hide_small_balances={hide_small_balances}
            address={address}
        />
    );
}

export const accountActivity = ({ address }) => {
    return (
        <AddressActivityListView
            address={address}
        />
    )
}

export const nftTokensUI = ({ chain_names = [
    "eth-mainnet",
    "matic-mainnet",
    "bsc-mainnet",
    "avalanche-mainnet",
    "avalanche-testnet",
    "optimism-mainnet",
], address }) => {
    return (
        <NFTWalletTokenListView
            chain_names={chain_names}
            address={address}
        />
    )
}

export const tokenTransferUI = ({ chain_name= "avalanche-testnet", address, contract_address}) => {
    return (
        <TokenTransfersListView
            chain_name={chain_name}
            address={address}
            contract_address={contract_address}
        />
    )
}

export const nftCollectionUi = ({ chain_name= "avalanche-testnet", collection_address, handleClick = () => { } }) => {
    return (
        <NFTCollectionTokenListView
            chain_name={chain_name}
            collection_address={collection_address}
            on_nft_click={handleClick}
        />
    )
}

export const nftDetailUi = ({ chain_name= "avalanche-testnet", collection_address, token_id }) => {
    return (
        <NFTDetailView
            chain_name={chain_name}
            collection_address={collection_address}
            token_id={token_id}
        />
    )
}
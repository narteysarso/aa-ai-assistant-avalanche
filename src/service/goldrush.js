import { AddressActivityListView, NFTCollectionTokenListView, NFTDetailView, NFTWalletTokenListView, TokenBalancesListView, TokenTransfersListView } from "@covalenthq/goldrush-kit"

export const getTokensUI = ({ chain_names, account, hide_small_balances = false }) => {
    return (
        <TokenBalancesListView
            chain_names={chain_names}
            hide_small_balances={hide_small_balances}
            address={account}
        />
    );
}

export const accountActivity = ({ account }) => {
    return (
        <AddressActivityListView
            address={account}
        />
    )
}

export const nftTokensUI = ({ chain_names, account }) => {
    return (
        <NFTWalletTokenListView
            chain_names={chain_names}
            address={account}
        />
    )
}

export const accountActivityUI = ({ chain_name, account, contract_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }) => {
    return (
        <TokenTransfersListView
            chain_name={chain_name}
            address={account}
            contract_address={contract_address}
        />
    )
}

export const nftCollectionUi = ({ chain_name, collection_address, handleClick = () => { } }) => {
    return (
        <NFTCollectionTokenListView
            chain_name={chain_name}
            collection_address={collection_address}
            on_nft_click={handleClick}
        />
    )
}

export const nftDetailUi = ({ chain_name, collection_address, token_id }) => {
    return (
        <NFTDetailView
            chain_name={chain_name}
            collection_address={collection_address}
            token_id={token_id}
        />
    )
}

export const trackTokenTransfer = ({chain_names, address, contract_address}) => {
    return (
        <TokenTransfersListView
    chain_name={chain_names} 
    address={address} 
    contract_address={contract_address} 
/>
    )
}
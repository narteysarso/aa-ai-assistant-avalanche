import { Button } from "antd";
import { ModalProvider } from '@particle-network/connect-react-ui';
import { GoldRushProvider } from "@covalenthq/goldrush-kit";
import { WalletEntryPosition } from '@particle-network/auth';
import { Ethereum, EthereumGoerli, Avalanche, AvalancheTestnet } from '@particle-network/chains';
import { evmWallets } from '@particle-network/connect';
import MainLayout from "./component/MainLayout";
import BuyToken from "./component/BuyToken";
import { accountActivityUI, getTokensUI, nftTokensUI } from "./service/goldrush";
import Chat from "./component/Chat";

export default function App() {

	return (

		<ModalProvider
			options={{
				projectId: process.env.REACT_APP_PROJECT_ID,
				clientKey: process.env.REACT_APP_CLIENT_KEY,
				appId: process.env.REACT_APP_APP_ID,
				chains: [
					Ethereum,
					EthereumGoerli,
					Avalanche,
					AvalancheTestnet
				],
				particleWalletEntry: {    //optional: particle wallet config
					displayWalletEntry: true, //display wallet button when connect particle success.
					defaultWalletEntryPosition: WalletEntryPosition.BR,
					supportChains: [
						Ethereum,
						EthereumGoerli,
						Avalanche,
						AvalancheTestnet
					],
					customStyle: {}, //optional: custom wallet style
				},
				securityAccount: { //optional: particle security account config
					//prompt set payment password. 0: None, 1: Once(default), 2: Always
					promptSettingWhenSign: 1,
					//prompt set master password. 0: None(default), 1: Once, 2: Always
					promptMasterPasswordSettingWhenLogin: 1
				},
				wallets: evmWallets({
					projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID, //replace with walletconnect projectId
					showQrModal: false
				}),
			}}
			theme={'auto'}
			language={'en'}   //optional：localize, default en
			walletSort={['Particle Auth', 'Wallet']} //optional：walelt order
			particleAuthSort={[    //optional：display particle auth items and order
				'email',
				'phone',
				'google',
				'apple',
				'facebook'
			]}
		>
			<GoldRushProvider
				apikey={process.env.REACT_APP_COVALENT_API_KEY} //use your API key

			>
				<MainLayout>
					<Button type="dashed">Hello Click ME</Button>
					<BuyToken />
					{getTokensUI({
						chain_names: [
							"eth-mainnet",
							"matic-mainnet",
							"bsc-mainnet",
							"avalanche-mainnet",
							"optimism-mainnet",
						], account: "0xCb90C09494d399Bc2AF8b0343621639CF83B910B"
					})}
					{
						nftTokensUI({
							chain_names: [
								"eth-mainnet",
								"matic-mainnet",
								"bsc-mainnet",
								"avalanche-mainnet",
								"optimism-mainnet",
							], account: "0xCb90C09494d399Bc2AF8b0343621639CF83B910B"
						})
					}
					{
						accountActivityUI({
							chain_name:"eth-mainnet", account: "0xCb90C09494d399Bc2AF8b0343621639CF83B910B"
						})
					}
					<Chat />
				</MainLayout>
			</GoldRushProvider>
		</ModalProvider>
	)
}
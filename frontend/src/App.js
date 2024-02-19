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
import { UIProvider } from "./context/useUI";
import AISwitcher from "./component/AISwitcher";

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
				particleWalletEntry: {   
					displayWalletEntry: true,
					defaultWalletEntryPosition: WalletEntryPosition.BR,
					supportChains: [
						Ethereum,
						EthereumGoerli,
						Avalanche,
						AvalancheTestnet
					],
					customStyle: {}, 
				},
				securityAccount: { 
					
					promptSettingWhenSign: 1,
					
					promptMasterPasswordSettingWhenLogin: 1
				},
				wallets: evmWallets({
					projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID, 
					showQrModal: false
				}),
			}}
			theme={'auto'}
			language={'en'}  
			walletSort={['Particle Auth', 'Wallet']} 
			particleAuthSort={[   
				'email',
				'phone',
				'google',
				'apple',
				'facebook'
			]}
		>
	
				<GoldRushProvider
					apikey={process.env.REACT_APP_COVALENT_API_KEY}
				>
					<MainLayout>
						<Button type="dashed">Hello Click ME</Button>
						<BuyToken />
						<AISwitcher />
						<Chat />
					</MainLayout>
				</GoldRushProvider>
			
		</ModalProvider>
	)
}
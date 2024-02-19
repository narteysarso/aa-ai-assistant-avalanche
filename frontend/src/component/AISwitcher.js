import { useContext } from "react"
import { evmWallets, isEVMProvider, isMetaMask, solanaWallets } from '@particle-network/connect';
import {
    useAccount,
    useConnectKit,
    useNetwork,
    useParticleProvider,
} from '@particle-network/connect-react-ui';

import { UIContext } from "../context/useUI"
import { UIs } from "../utils/constants";
import { sendTransaction } from "../service/particle";
import { getAccountBalance } from "../service/covalent";
import { notification } from "antd";
import "@covalenthq/goldrush-kit/styles.css";

export default function AISwitcher() {
    const { uiName, uiData, clearUIData } = useContext(UIContext);
    const provider = useParticleProvider();
    const { chain } = useNetwork();
    const account = useAccount()

    if (!uiName || !uiData) return null;

    const params = uiData.reduce((prev, { name, arg }, idx) => {
        return { ...prev, [name]: arg }
    }, {});

    if (uiName === "transaction_data") {
        getAccountBalance({ chain: params.senderChainName || chain.id, account, nft: true }).then(async (balances) => {
            console.log(balances);
            const token = balances.items.filter(({ contract_name,
                contract_ticker_symbol }) => ((contract_name.toLowerCase() === params.token.toLowerCase()) || (contract_ticker_symbol.toLowerCase() === params.token.toLowerCase())))[0];

            console.log(token);
            if (!token) { throw Error("Token not found in account") };

            if (token.balance < params.amount) { throw Error("Insufficient balance") }

            console.log("sending ....")
            
            await sendTransaction({ recipient: params.recipient, value: params.amount, decimals: token.contract_decimals, contract_address: token.contract_address, isnative: token.native_token, particleProvider: provider });
            
        }).catch(err => {
            console.log(err);
            if (err?.data) {
                notification.error(err.data.message);
            } else {
                notification.error(err.message);
            }
        });

        return "Kindly sign transaction in your wallet";
    }

    return UIs[uiName](params);
}
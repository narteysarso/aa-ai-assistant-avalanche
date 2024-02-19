import { useContext, useMemo } from "react"
import {
    useAccount,
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
    const { uiName, uiData } = useContext(UIContext);
    const provider = useParticleProvider();
    const { chain } = useNetwork();
    const account = useAccount()

    const component = useMemo(() => {
        if (!uiName || !uiData || !account || !chain || !provider) return null;

        const params = uiData.reduce((prev, { name, arg }, idx) => {
            return { ...prev, [name]: arg }
        }, {});

        if (uiName === "transaction_data") {
            getAccountBalance({ chain: params.senderChainName || chain.id, account, nft: true }).then(async (balances) => {
                console.log(balances);
                const token = balances.items.filter(({ contract_name,
                    contract_ticker_symbol }) => ((contract_name.toLowerCase() === params.token.toLowerCase()) || (contract_ticker_symbol.toLowerCase() === params.token.toLowerCase())))[0];

                console.log(token);
                const amount = parseFloat(params.amount).toString();
                if (!token) { throw Error("Token not found in account") };

                if (token.balance < amount) { throw Error("Insufficient balance") }

                console.log("sending ....")

                await sendTransaction({ recipient: params.recipient, value: amount, decimals: token.contract_decimals, contract_address: token.contract_address, isnative: token.native_token, particleProvider: provider });

            }).catch(err => {
                    notification.error({message: err?.message || err?.data?.message || err?.message || err});
            });

            return "Kindly sign transaction in your wallet";
        }

        return UIs[uiName](params);
    }, [uiName, uiData, account, chain, provider])

    return component;
}
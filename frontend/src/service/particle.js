import {ethers} from "ethers";
import { ERC20ABI } from "../utils/constants";

export const sendTransaction = async ({recipient, isnative, contract_address, decimals, senderChain, recipientChain,  value, particleProvider}) => {
    const provider = new ethers.providers.Web3Provider(particleProvider);
    const signer = provider.getSigner();
    const data = null;
    const amount = ethers.utils.parseUnits(value, decimals).toHexString();

    if(isnative){
        const txnData =Object.freeze({
            to: recipient,
            value: amount,
            data,
        });
        const txn = await signer.sendTransaction(txnData);
    
        const result = await txn.wait();

        return result;
    }else {
        const iface = new ethers.utils.Interface(ERC20ABI);
        const rawData = iface.functions.transfer.encode([recipient, amount]);
        const txnData =  Object.freeze({
            to: contract_address,
            value: "0x",
            data: rawData
        });

        const txn = await signer.sendTransaction(txnData);
    
        const result = await txn.wait();

        return result;
    }
};
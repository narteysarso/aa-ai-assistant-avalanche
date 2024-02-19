import {ethers} from "ethers";

export const sendTransaction = async ({recipient, isnative, contract_address, decimals , value, particleProvider}) => {
    const provider = new ethers.providers.Web3Provider(particleProvider);

    const signer = provider.getSigner();
    const data = null;
    const amount = ethers.utils.formatUnits(value, decimals);
    const txnData = (isnative) ? Object.freeze({
        to: recipient,
        value: amount,
        data,
    }): Object.freeze({
        to: contract_address,
        value: "0",
        data: "", // TODO: compute data hex

    });
    const txn = await signer.sendTransaction(txnData);

    const result = await txn.wait();

    return result;
};
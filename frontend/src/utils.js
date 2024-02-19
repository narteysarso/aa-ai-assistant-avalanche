import {ethers} from "ethers";

export const formatUnit = (amount, decimals) => {
    return ethers.utils.formatUnits(amount, decimals);
}

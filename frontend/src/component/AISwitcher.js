import { useContext } from "react"
import { UIContext } from "../context/useUI"
import { UIs } from "../utils/constants";

export default function AISwitcher() {
    const {uiName, uiData} = useContext(UIContext);

    if(!uiName || !uiData) return null;

    const params = uiData.reduce((prev, {name, arg}, idx) => {
        return {...prev,[name]: arg}
    },{});

    console.log(params);
    return UIs[uiName](params);
}
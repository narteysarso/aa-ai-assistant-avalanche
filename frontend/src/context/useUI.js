import { createContext, useState } from "react";
import { UIs } from "../utils/constants";

export const UIContext = createContext(false, null, () => { })


export function UIProvider({children}){

    const [uiName, setUIName] = useState(null);
    const [uiData, setUiData] = useState(null);

    const changeUI = (uiName, uiData) => {
        if(typeof uiName !== "string" || typeof uiData !== "object") return;
        if(!Object.keys(UIs).includes(uiName)) return;
        if(Object.keys(uiData).length < 2) return;
        setUIName(uiName);
        setUiData(uiData);

        console.log(uiName, uiData);
    }

    return (
        <UIContext.Provider value={{
            uiName,
            uiData,
            changeUI
        }}>
            {children}
        </UIContext.Provider>
    )
}
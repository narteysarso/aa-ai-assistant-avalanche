import { createContext, useState } from "react";
import { UIs } from "../utils/constants";

export const UIContext = createContext(false, null, () => { })


export function UIProvider({children}){

    const [ui, setUI] = useState(null);

    const changeUI = (uiName, uiData) => {
        if(typeof uiName !== "string" || typeof uiData !== "object") return;
        if(!Object.keys(UIs).includes(uiName)) return;
        if(Object.keys(uiData).length < 2) return;
        setUI({uiName, uiData});
    }

    const clearUIData = () => {
        setUI(prev => ({uiName: prev.uiName}));
    }

    return (
        <UIContext.Provider value={{
            uiName: ui?.uiName,
            uiData: ui?.uiData,
            changeUI,
            clearUIData
        }}>
            {children}
        </UIContext.Provider>
    )
}
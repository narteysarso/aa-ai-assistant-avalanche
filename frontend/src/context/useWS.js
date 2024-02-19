import { createContext, useContext, useEffect, useRef, useState } from "react";
import { socket } from "../service/websocket";
import { isValidThreadId } from "../utils/helpers";
import { ROLES } from "../utils/constants";
import { UIContext } from "./useUI";

export const WSContext = createContext(false, null, () => { })

export function WsProvider({ children }) {
    const [isConnected, setIsConnected] = useState(socket.connected)
    const [messages, setMessages] = useState([]);
    const [thread_id, setThreadId] = useState("");
    const {changeUI} = useContext(UIContext)

    const ws = useRef(null);

    const parseMessages = (event = []) => {
        console.log(event);
        const messages = event?.messages;

        if (!Array.isArray(messages)) return;

        const parsedMessage = messages?.reverse().map(({ data, type, thread_id, created_at }) => Object.freeze({
            owner: type,
            message: data?.content,
            timestamp: Date(created_at),
            imgsrc: ROLES[type]?.imgsrc
        }));

        setMessages(prev => parsedMessage);
    }

    const addHumanMessage = ({type, content, created_at, thread_id}) => {
        const msg = Object.freeze({
            owner: type,
            message: content,
            timestamp: Date(created_at),
            imgsrc: ROLES[type]?.imgsrc
        });

        setMessages(prev => [...prev, msg])
    }

    const handleMessages = (event) => {
        
        const {data, thread_id, type }= event;
        if(typeof data !== "object" || typeof type !== "string" || typeof thread_id !== "string")  return;
        if(!Object.keys(data).includes("name")) return;
        console.log(data);
        addHumanMessage({type, content: data.content, created_at: Date.now(), thread_id});
        changeUI(data.name, data.args);
    }

    const changeThreadID = (thread_id) => {
        if (!isValidThreadId(thread_id)) return;
        setThreadId(prev => thread_id);
        localStorage.setItem("thread_id", thread_id);
    }

    useEffect(() => {

        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onMessageEvent(value) {
            handleMessages(value)
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('message', onMessageEvent);

        ws.current = socket

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('message', onMessageEvent);
            socket.off('threadMessages', parseMessages);
        }
    }, []);


    useEffect(()=>{
        if(!isConnected) return;
        if(!isValidThreadId(thread_id)) return;
        socket.timeout(5000).emit("getThreadMessages", thread_id);

    },[isConnected, thread_id])

    return (
        <WSContext.Provider value={{
            isConnected,
            messages,
            threadId: thread_id,
            emit: ws.current?.emit.bind(ws.current),
            addHumanMessage,
            changeThreadID
        }}>
            {children}
        </WSContext.Provider>
    )
}



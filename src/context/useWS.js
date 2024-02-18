import { createContext, useEffect, useRef, useState } from "react";
import { socket } from "../service/websocket";
import { MESSAGE_STATUSES, ROLES } from "../utils/constants";
import { isValidThreadId } from "../utils/helpers";

export const WSContext = createContext(false, null, () => { })

export function WsProvider({ children }) {
    const [isConnected, setIsConnected] = useState(socket.connected)
    const [messages, setMessages] = useState([]);
    const [thread_id, setThreadId] = useState("");

    const ws = useRef(null);

    const handleMessages = (event = []) => {
        if (!MESSAGE_STATUSES.includes(event?.status)) return;
        const messages = event?.data;

        if (!Array.isArray(messages)) return;

        if (!thread_id) changeThreadID(messages[0]?.thread_id);

        const parsedMessage = messages?.reverse().map(({ content, role, thread_id, created_at }) => Object.freeze({
            owner: role,
            message: content[0]?.text?.value,
            timestamp: Date(created_at),
            imgsrc: ROLES[role]?.imgsrc
        }));

        setMessages(prev => parsedMessage);
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
        }
    }, []);


    useEffect(()=>{
        if(!isConnected) return;
        const thread_id = localStorage.getItem("thread_id");
        if(!isValidThreadId(thread_id)) return;
        setThreadId(prev => thread_id);
        socket.timeout(5000).emit("getThreadMessages", thread_id);

    },[isConnected])

    return (
        <WSContext.Provider value={{
            isConnected,
            messages,
            threadId: thread_id,
            emit: ws.current?.emit.bind(ws.current),
            changeThreadID
        }}>
            {children}
        </WSContext.Provider>
    )
}



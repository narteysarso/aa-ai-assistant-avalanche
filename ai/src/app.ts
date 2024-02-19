import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import agent from "./reactAgent";

require("dotenv").config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: process.env.ALLOWED_ORIGINS?.split(",")
	}
});
const port = parseInt(process.env.WS_PORT as string) || 3090;
const cacheThread = process.env.CACHE_THREAD || true;
const socketThreadMap: Map<string, string> = new Map();

io.on("connection", (socket: Socket) => {
	console.log("New user connected");

	socket.on("message", async (data: { message: string, thread_id: string }, callback = (e?: any) => { }) => {
		try {
			// Add the user message to the conversation history

			const { message, thread_id } = data;

			if (!message) return socket.emit("message", { status: "error", message: "invalid message content", thread_id });

			socketThreadMap.set(socket.id, thread_id);

			const response = await agent.invoke(message, thread_id);

			socket.emit("message", {...response, thread_id, type: "ai"});

			callback();
		} catch (error: any) {

			console.error(error);

			callback(`Error: ${error.message}`);
		}
	});

	socket.on("getThreadMessages", async (thread_id: string, callback = (e?: any) => { }) => {
		try {
			const threadMessages = await agent.getMessages(thread_id);
			socket.emit("threadMessages", {messages: threadMessages });
			callback();
		} catch (error: any) {
			console.error(error);
			callback(`Error: ${error.message}`);
		}
	});

	socket.on("disconnect", async () => {
		console.log(`User disconnected`);
		if (!cacheThread) {
			socketThreadMap.delete(socket.id)
		}
	});

});

httpServer.listen(port, () => console.log(`server ready at port ${port}`))



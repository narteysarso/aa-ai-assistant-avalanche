import { io } from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_WS_URL || 'http://localhost:3090'; //http://localhost:3090/socket.io/?EIO=4&transport=websocket

export const socket = io(URL);
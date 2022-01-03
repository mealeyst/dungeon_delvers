import { io } from 'socket.io-client';

const { APP_BASE_URL, APP_SERVER_PORT } = process.env;
const URL = `http://${APP_BASE_URL}:${APP_SERVER_PORT}`;

const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;

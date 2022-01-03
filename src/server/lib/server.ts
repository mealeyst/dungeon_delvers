import http from "http";
import { Server } from "socket.io";
const { APP_BASE_URL, APP_CLIENT_PORT, APP_SERVER_PORT = "3000" } = process.env;

const port = parseInt(APP_SERVER_PORT);
const clientUrl = `http://${APP_BASE_URL}:${APP_CLIENT_PORT}`;
const httpServer = http.createServer().listen(port, "0.0.0.0");
console.log(clientUrl);
const io = new Server(httpServer, {
  cors: {
    origin: clientUrl,
  },
});
console.log(`Running server on port:${port}`);

io.on("connection", (socket) => {
  console.log("user connected");
  socket.emit("welcome", "welcome man");
});

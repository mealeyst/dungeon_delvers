import { Server } from 'socket.io'
const {
  APP_SERVER_PORT = '3000'
} = process.env

const port = parseInt(APP_SERVER_PORT)
const io = new Server(port);
console.log(`Starting server on port: ${port}`)
console.log(io)
io.on("connection", (socket:any) => {
  console.log("user connected");
  socket.emit("welcome", "welcome man");
});
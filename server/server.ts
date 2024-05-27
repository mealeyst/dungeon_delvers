import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;

const io = new Server({
  cors: {
    origin: "*",
  },
});
console.log(`listening on port ${port}`);

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  // send an event to the client
  socket.emit("welcome", "hello from the server!");

  // upon disconnection
  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});

io.listen(port);
import http from 'http';
import { Server as IOServer } from 'socket.io'
import 'dotenv/config'

const main = () => {
  const port = process.env.PORT || 4000

  const server = http.createServer()
  const io = new IOServer(server, {
    cors: {
      origin: '*'
    }
  })
  server.listen(port, () => {
    console.log(`Listening on port: ${port}`)
  })
}
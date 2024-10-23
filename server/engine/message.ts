import { Server, Socket } from 'socket.io'

type ChatArgs = {
  characterID: number
  messaage: string
  location: {
    x: number
    y: number
    z: number
  }
  zoneID: number
}

export default (_io: Server, socket: Socket) => {
  socket.on(
    'character:say',
    ({ characterID, messaage, location, zoneID }: ChatArgs) => {
      const { name } = fetchCharacter(args.characterID)
      socket.emit(
        `zone:${zoneID}character:say`,
        `${name} says: ${args.message}`,
        location,
      )
    },
  )
}

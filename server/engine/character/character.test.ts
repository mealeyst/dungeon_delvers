import { createServer } from 'node:http'
import { AddressInfo } from 'net'
import { io as Client, Socket as ClientSocket } from 'socket.io-client'
import { Server, Socket as ServerSocket } from 'socket.io'

import eventHandlers, {
  Character,
  create,
  CharacterCreationArgs,
} from './character'
import { ARCHTYPES } from './class/class'
import { ATTRIBUTES } from './attributes'
import { STATS } from './stats'

const characterArgs: CharacterCreationArgs = {
  name: 'Test Character',
  archtype: ARCHTYPES.FIGHTER,
  attributes: {
    [ATTRIBUTES.CON]: 20,
    [ATTRIBUTES.DEX]: 16,
    [ATTRIBUTES.INT]: 2,
    [ATTRIBUTES.MIG]: 11,
    [ATTRIBUTES.PER]: 15,
    [ATTRIBUTES.RES]: 10,
  },
}

const characterResult = {
  name: 'Test Character',
  stats: {
    [STATS.ACCURACY]: 27,
    [STATS.ACTION_SPEED]: 1.18,
    [STATS.AREA_OF_EFFECT]: 0.58,
    [STATS.CONCENTRATION]: 1,
    [STATS.DAMAGE]: 1.03,
    [STATS.DEFLECTION]: 1,
    [STATS.DURATION]: 0.65,
    [STATS.FORTITUDE]: 1.16,
    [STATS.HEALING]: 1.03,
    [STATS.HEALTH]: 59,
    [STATS.REFLEX]: 1.22,
    [STATS.WILLPOWER]: 0.86,
  },
  currentHealth: 59,
  attributes: {
    [ATTRIBUTES.CON]: 18,
    [ATTRIBUTES.DEX]: 16,
    [ATTRIBUTES.INT]: 3,
    [ATTRIBUTES.MIG]: 11,
    [ATTRIBUTES.PER]: 15,
    [ATTRIBUTES.RES]: 10,
  },
}
describe('Character', () => {
  it('should create a character with the correct stats and attributes', () => {
    const character = create(characterArgs)
    expect(character.attributes[ATTRIBUTES.CON]).toEqual(
      characterResult.attributes[ATTRIBUTES.CON],
    )
    expect(character.attributes[ATTRIBUTES.DEX]).toEqual(
      characterResult.attributes[ATTRIBUTES.DEX],
    )
    expect(character.attributes[ATTRIBUTES.INT]).toEqual(
      characterResult.attributes[ATTRIBUTES.INT],
    )
    expect(character.attributes[ATTRIBUTES.MIG]).toEqual(
      characterResult.attributes[ATTRIBUTES.MIG],
    )
    expect(character.attributes[ATTRIBUTES.PER]).toEqual(
      characterResult.attributes[ATTRIBUTES.PER],
    )
    expect(character.attributes[ATTRIBUTES.RES]).toEqual(
      characterResult.attributes[ATTRIBUTES.RES],
    )
    expect(character.stats[STATS.ACCURACY]).toEqual(
      characterResult.stats[STATS.ACCURACY],
    )
    expect(character.stats[STATS.ACTION_SPEED]).toEqual(
      characterResult.stats[STATS.ACTION_SPEED],
    )
    expect(character.stats[STATS.AREA_OF_EFFECT]).toEqual(
      characterResult.stats[STATS.AREA_OF_EFFECT],
    )
    expect(character.stats[STATS.CONCENTRATION]).toEqual(
      characterResult.stats[STATS.CONCENTRATION],
    )
    expect(character.stats[STATS.DAMAGE]).toEqual(
      characterResult.stats[STATS.DAMAGE],
    )
    expect(character.stats[STATS.DEFLECTION]).toEqual(
      characterResult.stats[STATS.DEFLECTION],
    )
    expect(character.stats[STATS.DURATION]).toEqual(
      characterResult.stats[STATS.DURATION],
    )
    expect(character.stats[STATS.FORTITUDE]).toEqual(
      characterResult.stats[STATS.FORTITUDE],
    )
    expect(character.stats[STATS.HEALING]).toEqual(
      characterResult.stats[STATS.HEALING],
    )
    expect(character.stats[STATS.HEALTH]).toEqual(
      characterResult.stats[STATS.HEALTH],
    )
    expect(character.stats[STATS.REFLEX]).toEqual(
      characterResult.stats[STATS.REFLEX],
    )
    expect(character.stats[STATS.WILLPOWER]).toEqual(
      characterResult.stats[STATS.WILLPOWER],
    )
    expect(character.currentHealth).toEqual(characterResult.currentHealth)
  })
})

describe('Character eventHandler', () => {
  let io: Server
  let serverSocket: ServerSocket
  let clientSocket: ClientSocket

  beforeAll(done => {
    const httpServer = createServer()
    io = new Server(httpServer)
    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo
      clientSocket = Client(`http://localhost:${port}`)
      io.on('connection', socket => {
        serverSocket = socket
        eventHandlers(io, socket)
      })
      clientSocket.on('connect', done)
    })
  })

  afterAll(() => {
    io.close()
    clientSocket.disconnect()
  })

  test('create should be called', done => {
    clientSocket.emit('character:create', characterArgs, (args: Character) => {
      expect(args).toEqual(characterResult)
      done()
    })
  })
})

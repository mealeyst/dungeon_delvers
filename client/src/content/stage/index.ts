import { Entry } from './entry'
import { Exit } from './exit'
import { Heal } from './heal'
import { Monster } from './monster'
export { Room } from './room'
import { Treasure } from './treasure'

export const Rooms = { Entry, Exit, Heal, Monster, Treasure }
export const isRoomKey = <Rooms>(
  x: Rooms,
  k: PropertyKey,
): k is keyof Rooms => {
  return k in Rooms
}

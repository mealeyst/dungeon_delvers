import { Vector3 } from '@babylonjs/core'
import { Room } from '../../content/stage'

export class Prim {
  private unreachedRooms: Set<Room>
  private minimumSpanningTree: Set<Vector3> = new Set()
  constructor(rooms: Room[], startRoomIndex: number) {
    this.unreachedRooms = new Set(
      rooms.sort((room_a, room_b) => {
        return room_a.y - room_b.y
      }),
    )
    this.unreachedRooms.delete(rooms[startRoomIndex])
    this.minimumSpanningTree.add(rooms[startRoomIndex].center)
    while (this.unreachedRooms.size > 0) {
      let record = Infinity
      let nextRoom = this.unreachedRooms.values().next().value
      this.minimumSpanningTree.forEach(center => {
        this.unreachedRooms.forEach(room => {
          if (Vector3.Distance(center, room.center) < record) {
            record = Vector3.Distance(center, room.center)
            nextRoom = room
          }
        })
      })
      this.minimumSpanningTree.add(nextRoom.center)
      this.unreachedRooms.delete(nextRoom)
    }
  }
  get tree() {
    return this.minimumSpanningTree
  }
}

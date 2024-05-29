import {
  Color3,
  Mesh,
  Scene,
  StandardMaterial,
  Vector3,
  VertexData,
} from '@babylonjs/core'
import { rooms } from './dungeon_modules.json'

export type RoomKeys = keyof typeof rooms

// export type RoomProps = {
//   name: string
//   type: RoomKeys
// }

type RoomData = {
  positions: number[]
  indices: number[]
}

export class Room {
  _mesh: Mesh
  constructor(name: string, type: RoomKeys, scene: Scene) {
    this._mesh = new Mesh(name, scene)
    const room = rooms[type] as RoomData
    const vertexData = new VertexData()
    vertexData.positions = room.positions
    vertexData.indices = room.indices
    vertexData.applyToMesh(this._mesh)
    const mat = new StandardMaterial('mat', scene)
    this._mesh.material = mat
  }

  get position() {
    return this._mesh.position
  }

  set position(vec: Vector3) {
    this._mesh.position = vec
  }
  // get roomCountLimit() {
  //   return this._roomCountLimit
  // }
  // get x() {
  //   return this._x
  // }
  // get y() {
  //   return this._y
  // }
  // get z() {
  //   return this._z
  // }
  // get width() {
  //   return this._width
  // }
  // get depth() {
  //   return this._depth
  // }
  // get height() {
  //   return this._height
  // }
  // get name() {
  //   return this._name
  // }
  // get center() {
  //   return new Vector3(this._x, this._y, this._z)
  // }
  // public addNeighbor(room: Room) {
  //   this._neighbors = [...this._neighbors, room]
  // }
}

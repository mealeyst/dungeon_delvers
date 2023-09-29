import {
  Color3,
  GroundMesh,
  Material,
  Mesh,
  MeshBuilder,
  Nullable,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from '@babylonjs/core'

export type RoomProps = {
  color?: Color3
  height: number
  depth: number
  name: string
  roomCountLimit?: number
  subdivisions?: number
  type?: string
  width: number
  x?: number
  y?: number
  z?: number
}

export class Room {
  private _roomCountLimit: number | undefined
  private _height: number
  private _depth: number
  private _neightbors: Room[] = []
  private _type: string | undefined
  private _width: number
  private _x: number
  private _y: number
  private _z: number
  private _name: string
  constructor(
    args: RoomProps = { name, type: 'room', width: 4, depth: 4, height: 4 },
  ) {
    this._depth = args.depth
    this._height = args.height
    this._roomCountLimit = args.roomCountLimit
    this._type = args.type
    this._width = args.width
    this._x = args.x || 0
    this._y = args.y || 0
    this._z = args.z || 0
    this._name = args.name
  }
  get roomCountLimit() {
    return this._roomCountLimit
  }
  get x() {
    return this._x
  }
  get y() {
    return this._y
  }
  get z() {
    return this._z
  }
  get width() {
    return this._width
  }
  get depth() {
    return this._depth
  }
  get height() {
    return this._height
  }
  get name() {
    return this._name
  }
  center() {
    return new Vector3(this._x, this._y, this._z)
  }
  public addNeighbor(room: Room) {
    this._neightbors = [...this._neightbors, room]
  }
}

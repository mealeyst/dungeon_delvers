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
  height?: number
  length: number
  name?: string | number
  roomCountLimit?: number
  subdivisions?: number
  type?: string
  width: number
  x?: number
  y?: number
  z?: number
}

export class Room extends TransformNode {
  private _roomCountLimit: number | undefined
  private _ceiling: Mesh | undefined
  private _floor: GroundMesh
  private _height: number | undefined
  private _length: number
  private _neightbors: Room[] = []
  private _material: Nullable<StandardMaterial>
  private scene: Scene
  private _subdivisions: number | undefined
  private _type: string | undefined
  private _width: number
  private _x: number
  private _y: number
  private _z: number
  constructor(
    args: RoomProps = { type: 'room', width: 4, length: 4 },
    scene: Scene,
  ) {
    const identifier = `${args.type || 'room'}${
      args.name !== undefined ? `_${args.name}` : '_default'
    }`
    super(identifier, scene)
    this._length = args.length
    this._material = null
    this.scene = scene
    this._roomCountLimit = args.roomCountLimit
    this._subdivisions = args.subdivisions
    this._type = args.type
    this._width = args.width
    this._x = args.x || 0
    this._y = args.y || 0
    this._z = args.z || 0
    this._floor = MeshBuilder.CreateGround(
      `${this.id}_floor`,
      {
        width: this._width,
        height: this._length,
        subdivisions: this._subdivisions,
      },
      this.scene,
    )
    this._floor.parent = this
    this._floor.position.x = this._x
    this._floor.position.y = this._y
    this._floor.position.z = this._z
    if (this._height) {
      this._ceiling = this._floor.clone()
      this._ceiling.position.y = this._height
    }
    if (args.color) {
      this.setColor(args.color)
    }
  }
  setColor(color: Color3) {
    this._material = new StandardMaterial(`${this.id}_material`, this.scene)
    this._material.diffuseColor = color
    this._floor.material = this._material
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
  public addNeighbor(room: Room) {
    this._neightbors = [...this._neightbors, room]
  }
}

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
} from '@babylonjs/core'

export type RoomProps = {
  color?: Color3
  type?: string
  name?: string | number
  width: number
  length: number
  height?: number
  x?: number
  y?: number
  z?: number
  subdivisions?: number
}

export class Room extends TransformNode {
  private ceiling: Mesh | undefined
  private floor: GroundMesh
  private height: number | undefined
  private length: number
  private material: Nullable<StandardMaterial>
  private scene: Scene
  private subdivisions: number | undefined
  private type: string | undefined
  private width: number
  private x: number
  private y: number
  private z: number
  constructor(
    args: RoomProps = { type: 'room', width: 4, length: 4 },
    scene: Scene,
  ) {
    const identifier = `${args.type || 'room'}${
      args.name !== undefined ? `_${args.name}` : '_default'
    }`
    super(identifier, scene)
    this.length = args.length
    this.width = args.width
    this.x = args.x || 0
    this.y = args.y || 0
    this.z = args.z || 0
    this.material = null
    this.subdivisions = args.subdivisions
    this.type = args.type
    this.scene = scene
    this.floor = MeshBuilder.CreateGround(
      `${this.id}_floor`,
      {
        width: this.width,
        height: this.length,
        subdivisions: this.subdivisions,
      },
      this.scene,
    )
    this.floor.parent = this
    this.floor.position.x = this.x
    this.floor.position.y = this.y
    this.floor.position.z = this.z
    if (this.height) {
      this.ceiling = this.floor.clone()
      this.ceiling.position.y = this.height
    }
    if (args.color) {
      this.setColor(args.color)
    }
  }
  setColor(color: Color3) {
    this.material = new StandardMaterial(`${this.id}_material`, this.scene)
    this.material.diffuseColor = color
    this.floor.material = this.material
  }
}

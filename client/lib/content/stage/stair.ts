import { Mesh, Vector3, VertexData } from '@babylonjs/core'

type StairOptions = {
  height: number
  width: number
  depth: number
  targetStepHeight?: number
  treadThickness?: number
  treadDepth?: number
  x: number
  y: number
  z: number
}

export class Stair extends Mesh {
  constructor(name: string, options: StairOptions, scene: any) {
    super(name, scene)
    const positions = [
      new Vector3(options.x, options.y, options.z).asArray(),
      new Vector3(options.x, options.height, options.z).asArray(),
      new Vector3(options.width, options.height, options.z).asArray(),
      new Vector3(options.width, options.y, options.z).asArray(),
      new Vector3(options.x, options.y, options.z).asArray(),
      new Vector3(options.width, options.height, options.z).asArray(),
      new Vector3(options.x, options.y, options.z).asArray(),
      new Vector3(options.x, options.y, options.depth).asArray(),
      new Vector3(options.x, options.height, options.depth).asArray(),
    ]

    var vertexData = new VertexData()

    vertexData.positions = positions.flat()
    vertexData.indices = Array.from(positions.keys())

    vertexData.applyToMesh(this)
    this.position.x = options.x
    this.position.y = options.y
    this.position.z = options.z
  }
}

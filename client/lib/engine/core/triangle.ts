import { MeshBuilder, Scene, TransformNode, Vector3 } from '@babylonjs/core'

type TriangleProps = {
  id: string | number
  points: Vector3[]
}

export class Triangle extends TransformNode {
  constructor(args: TriangleProps, scene: Scene) {
    super(`triangle_${args.id}`, scene)
    const line = MeshBuilder.CreateLines(`lines_${args.id}`, {
      points: args.points,
    })
    line.parent = this
  }
}

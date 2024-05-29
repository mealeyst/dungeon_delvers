import {
  Color3,
  LinesMesh,
  MeshBuilder,
  Scene,
  TransformNode,
  Vector3,
} from '@babylonjs/core'

type TriangleProps = {
  id: number
  vectors: Vector3[]
}

type Line = {
  vectors: Vector3[]
  mesh: LinesMesh
}

export class Triangle extends TransformNode {
  private _lines: Line[] = []
  public scene: Scene
  constructor(args: TriangleProps, scene: Scene) {
    super(`triangle_${args.id}`, scene)
    this.scene = scene
    args.vectors.forEach((currentVector, index) => {
      let lineVectors = []
      if (index < args.vectors.length - 1) {
        lineVectors.push(currentVector, args.vectors[index + 1])
      } else {
        lineVectors.push(currentVector, args.vectors[0])
      }
      const id = `triangle${args.id}_line${index}`
      const mesh = MeshBuilder.CreateLines(id, {
        points: lineVectors,
      })
      mesh.parent = this
      mesh.alphaIndex = 0
      this._lines.push({ vectors: lineVectors, mesh })
    })
  }
  shortestSide() {
    const shortest = this._lines.reduce((acc: Line, current: Line) => {
      if (
        Vector3.Distance(current.vectors[0], current.vectors[1]) <
        Vector3.Distance(acc.vectors[0], acc.vectors[1])
      ) {
        acc = current
      }
      return acc
    }, this._lines[0])

    shortest.mesh.color = new Color3(0, 1, 0)
    shortest.mesh.alphaIndex = 1
    return shortest
  }
}

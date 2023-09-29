import { Mesh, Scene, VertexData } from "@babylonjs/core"

type StairOptions = {
  x: number
  y: number
  z: number
  width: number
  height: number
  depth: number
  stepHeight?: number
  treadThickness?: number
  treadDepth?: number
}

export class Stair extends Mesh {
  x: number
  y: number
  z: number
  width: number
  height: number
  depth: number
  stepHeight = 7
  treadThickness = 1.5
  treadDepth = 10.5

  constructor (name: string, scene: Scene, options: StairOptions) {
    super(name, scene)
    this.x = options.x
    this.y = options.y
    this.z = options.z
    this.width = options.width
    this.height = options.height
    this.depth = options.depth
    const positions = [-5, 2, -3, -7, -2, -3, -3, -2, -3, 5, 2, 3, 7, -2, 3, 3, -2, 3];
	  const indices = [0, 1, 2, 3, 4, 5];
    const vertexData = new VertexData();
    	//Assign positions and indices to vertexData
    vertexData.positions = positions;
    vertexData.indices = indices;	

    //Apply vertexData to custom mesh
    vertexData.applyToMesh(this);
  }
}
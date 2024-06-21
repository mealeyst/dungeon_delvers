import {
  Mesh,
  Scene,
  Vector3,
  VertexBuffer,
  StandardMaterial,
  VertexData,
  GroundMesh,
  MeshBuilder,
  CreateGround,
} from "@babylonjs/core"
import HeightGenerator from "./heightGenerator"


interface TerrainChunkInterface {
  height: number
  heightGenerators: HeightGenerator[]
  minHeight: number
  offset: Vector3
  scale: number
  subdivisions: number
  width: number
}

class TerrainChunk {

  private _chunk: GroundMesh
  private _chunkParams: TerrainChunkInterface

  constructor(
    scene: Scene,
    chunkParams: TerrainChunkInterface,
    material: StandardMaterial
  ) {
    this._chunk = MeshBuilder.CreateGround(
      `ground_${chunkParams.offset.x}_${chunkParams.offset.z}`,
      {
        width: chunkParams.width,
        height: chunkParams.height,
        subdivisions: chunkParams.subdivisions,
        updatable: true,
      },
      scene
    )
    this.chunk.position = chunkParams.offset
    this._chunkParams = chunkParams
    this._chunk.material = material
    this._chunk.checkCollisions = true
    this.rebuild()
  }

  get chunk() {
    return this._chunk
  }

  public rebuild = () => {
    const pos = this._chunk.getVerticesData(VertexBuffer.PositionKind)
    if (pos !== null) {
      const indices = this._chunk.getIndices()
      const normals: number[] = []
      const numberOfVertices = pos.length / 3
      for (
        let verticesIndex = 0;
        verticesIndex < numberOfVertices;
        verticesIndex += 1
      ) {
        let normalization = 0
        const heightPairs = []
        // Verticies
        const x = pos[verticesIndex * 3]
        const y = pos[verticesIndex * 3 + 2]
        let z = 0
        for (
          let generatorIndex = 0;
          generatorIndex < this._chunkParams.heightGenerators.length;
          generatorIndex += 1
        ) {
          const gen = this._chunkParams.heightGenerators[generatorIndex]
          heightPairs.push(
            gen.Get(
              x + this._chunkParams.offset.x,
              y + this._chunkParams.offset.z
            )
          )
          normalization += heightPairs[heightPairs.length - 1][1]
        }
        if (normalization > 0) {
          heightPairs.forEach((heightPair) => {
            z += (heightPair[0] * heightPair[1]) / normalization
          })
        }
        pos[verticesIndex * 3 + 1] = z
      }
      VertexData.ComputeNormals(pos, indices, normals)
      this._chunk.updateVerticesData(VertexBuffer.PositionKind, pos)
      this._chunk.updateVerticesData(VertexBuffer.NormalKind, normals)
    }
  }
}

export default TerrainChunk
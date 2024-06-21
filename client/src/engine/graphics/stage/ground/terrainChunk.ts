import {
  MeshBuilder,
  Mesh,
  Scene,
  Vector3,
  VertexBuffer,
  StandardMaterial,
  Color3,
  VertexData,
  Texture,
} from "@babylonjs/core";
import HeightGenerator from "./heightGenerator";
import ground from '../../../../../public/assets/textures/ground.jpg'

interface TerrainChunkInterface {
  height: number;
  heightGenerators: HeightGenerator[];
  minHeight: number;
  offset: Vector3;
  scale: number;
  subdivisions: number;
  width: number;
}

class TerrainChunk {

  chunk: Mesh;

  chunkParams: TerrainChunkInterface;

  private scene: Scene;

  constructor(
    scene: Scene,
    chunkParams: TerrainChunkInterface,
  ) {
    this.scene = scene;
    this.chunkParams = chunkParams;
    this.chunk = MeshBuilder.CreateGround(
      `ground_${chunkParams.offset.x}_${chunkParams.offset.z}`,
      {
        width: this.chunkParams.width,
        height: this.chunkParams.height,
        subdivisions: this.chunkParams.subdivisions,
        updatable: true,
      },
      this.scene
    );
    this.chunk.position = chunkParams.offset;
    this.rebuild();
  }

  public rebuild = () => {
    const pos = this.chunk.getVerticesData(VertexBuffer.PositionKind);

    if (pos !== null) {
      const indices = this.chunk.getIndices();
      const normals: number[] = [];
      const numberOfVertices = pos.length / 3;
      for (
        let verticesIndex = 0;
        verticesIndex < numberOfVertices;
        verticesIndex += 1
      ) {
        let normalization = 0;
        const heightPairs = [];
        // Verticies
        const x = pos[verticesIndex * 3];
        const y = pos[verticesIndex * 3 + 2];
        let z = 0;
        for (
          let generatorIndex = 0;
          generatorIndex < this.chunkParams.heightGenerators.length;
          generatorIndex += 1
        ) {
          const gen = this.chunkParams.heightGenerators[generatorIndex];
          heightPairs.push(
            gen.Get(
              x + this.chunkParams.offset.x,
              y + this.chunkParams.offset.z
            )
          );
          normalization += heightPairs[heightPairs.length - 1][1];
        }
        if (normalization > 0) {
          heightPairs.forEach((heightPair) => {
            z += (heightPair[0] * heightPair[1]) / normalization;
          });
        }
        pos[verticesIndex * 3 + 1] = z;
      }
      const groundMaterial = new StandardMaterial("ground", this.scene);
      groundMaterial.diffuseTexture = new Texture(ground);
      groundMaterial.diffuseTexture?.scale(6);
      groundMaterial.specularColor = new Color3(0, 0, 0);
      this.chunk.material = groundMaterial;
      VertexData.ComputeNormals(pos, indices, normals);
      this.chunk.updateVerticesData(VertexBuffer.PositionKind, pos);
      this.chunk.updateVerticesData(VertexBuffer.NormalKind, normals);
    }
  };
}

export default TerrainChunk;
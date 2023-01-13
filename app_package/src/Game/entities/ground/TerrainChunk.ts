import {
  MeshBuilder,
  Mesh,
  Scene,
  Vector3,
  VertexBuffer,
  StandardMaterial,
  Color3,
  VertexData,
} from "@babylonjs/core";
import { Assets } from "../../Assets";
import HeightGenerator from "./HeightGenerator";

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
  assets: Assets;

  chunk: Mesh;

  chunkParams: TerrainChunkInterface;

  private scene: Scene;

  constructor(
    scene: Scene,
    chunkParams: TerrainChunkInterface,
    assets: Assets
  ) {
    this.scene = scene;
    this.chunkParams = chunkParams;
    this.assets = assets;
    this.chunk = MeshBuilder.CreateGround(
      "ground",
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
      groundMaterial.diffuseTexture = this.assets.groundTexture;
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

import { Scene, TransformNode, Vector2, Vector3 } from "@babylonjs/core";
import NoiseGenerator from "../../../core/noise";
import HeightGenerator from "./heightGenerator";

import TerrainChunk from "./terrainChunk";

interface Chunk {
  chunk: TerrainChunk;
  edges: string[];
}

export class TerrainChunkManager extends TransformNode {

  chunks: Record<string, Chunk> | {};

  chunkSize: number;

  noise: NoiseGenerator;

  scene: Scene;

  private _exponentiation = 3.9;
  private _height = 100;
  private _lacunarity = 2.0;
  private _noiseType = "perlin";
  private _octaves = 6;
  private _persistence = 2;
  private _scale = 125.0;
  private _seed = 1;

  constructor(name: string, scene: Scene) {
    super(name, scene);
    this.scene = scene;
    this.chunkSize = 50;
    this.chunks = {};

    this.noise = new NoiseGenerator({
      exponentiation: this._exponentiation,
      height: this._height,
      lacunarity: this._lacunarity,
      noiseType: this._noiseType,
      octaves: this._octaves,
      persistence: this._persistence,
      scale: this._scale,
      seed: this._seed,
    });
    this.setNoise();
    this.initializeTerrain();
  }

  private setNoise = () => {
    if (this.chunks) {
      Object.values(this.chunks).forEach(({ chunk }) => {
        chunk.rebuild();
      });
    }
  };

  static key = (x: number, z: number) => {
    return `${x}.${z}`;
  };

  private addChunk = (x: number, z: number) => {
    const offset = new Vector2(x * this.chunkSize, z * this.chunkSize);
    const chunk = new TerrainChunk(
      this.scene,
      {
        offset: new Vector3(offset.x, 0, offset.y),
        scale: 1,
        width: this.chunkSize,
        height: this.chunkSize,
        subdivisions: 50,
        heightGenerators: [
          new HeightGenerator(this.noise, offset, 100000, 100000 + 1),
        ],
        minHeight: 0,
      }
    );
    const k = TerrainChunkManager.key(x, z);
    const edges = [];
    for (let xi = -1; xi <= 1; xi += 1) {
      for (let zi = -1; zi <= 1; zi += 1) {
        if (xi !== 0 || zi !== 0) {
          edges.push(TerrainChunkManager.key(x + xi, z + zi));
        }
      }
    }

    this.chunks = Object.assign(
      {
        [k]: {
          chunk,
          edges,
        },
      },
      this.chunks
    );
  };

  private initializeTerrain = () => {
    this.chunks = {};

    // DEMO
    // this.addChunk(0, 0);

    for (let x = -1; x <= 1; x += 1) {
      for (let z = -1; z <= 1; z += 1) {
        this.addChunk(x, z);
      }
    }
  };
}
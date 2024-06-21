import { Scene, Vector2, Vector3 } from "@babylonjs/core";
import NoiseGenerator from "../../../core/noise";
import HeightGenerator from "./heightGenerator";

import TerrainChunk from "./terrainChunk";

interface Chunk {
  chunk: TerrainChunk;
  edges: string[];
}

export class TerrainChunkManager {

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

  constructor(scene: Scene) {
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

  // private initializeGui = () => {
  //   const noiseRollup = this.gui.addFolder("Terrain.Noise");
  //   noiseRollup
  //     .add(this.guiParams.noise, "noiseType", ["simplex", "perlin", "random"])
  //     .onChange(this.setNoise)
  //     .setValue("random");
  //   noiseRollup
  //     .add(this.guiParams.noise, "scale", 64.0, 1024.0)
  //     .onChange(this.setNoise);
  //   noiseRollup
  //     .add(this.guiParams.noise, "octaves", 1, 20)
  //     .onChange(this.setNoise);
  //   noiseRollup
  //     .add(this.guiParams.noise, "persistence", 0.01, 2.0)
  //     .onChange(this.setNoise);
  //   noiseRollup
  //     .add(this.guiParams.noise, "lacunarity", 0.01, 4.0)
  //     .onChange(this.setNoise);
  //   noiseRollup
  //     .add(this.guiParams.noise, "exponentiation", 0.1, 10.0)
  //     .onChange(this.setNoise);
  //   noiseRollup
  //     .add(this.guiParams.noise, "height", 0, 256)
  //     .onChange(this.setNoise);

  //   const heightmapRollup = this.gui.addFolder("Terrain.Heightmap");
  //   heightmapRollup
  //     .add(this.guiParams.heightmap, "height", 0, 128)
  //     .onChange(this.setNoise);

  //   const terrainRollup = this.gui.addFolder("Terrain");
  //   terrainRollup.add(this.guiParams.mesh, "wireframe").onChange(() => {});
  // };

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
        subdivisions: 100,
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
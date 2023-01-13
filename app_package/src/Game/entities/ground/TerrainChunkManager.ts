import { Scene, Vector2, Vector3 } from "@babylonjs/core";
import { GUI } from "dat.gui";
import NoiseGenerator from "../../../utils/noise";
import { Assets } from "../../Assets";
import HeightGenerator from "./HeightGenerator";

import TerrainChunk from "./TerrainChunk";
// import HeightGenerator from './HeightGenerator';

interface TerrainChunkManagerGuiInterface {
  noise: {
    exponentiation: number;
    height: number;
    lacunarity: number;
    noiseType: string;
    octaves: number;
    persistence: number;
    scale: number;
    seed: number;
  };
  heightmap: {
    height: number;
  };
  mesh: {
    wireframe: boolean;
  };
}

interface Chunk {
  chunk: TerrainChunk;
  edges: string[];
}

class TerrainChunkManager {
  assets: Assets;

  chunks: Record<string, Chunk> | {};

  chunkSize: number;

  gui: GUI;

  guiParams: TerrainChunkManagerGuiInterface;

  noise: NoiseGenerator;

  scene: Scene;

  constructor(gui: GUI, scene: Scene, assets: Assets) {
    this.gui = gui;
    this.scene = scene;
    this.chunkSize = 200;
    this.chunks = {};
    this.guiParams = {
      noise: {
        exponentiation: 3.9,
        height: 100,
        lacunarity: 2.0,
        noiseType: "simplex",
        octaves: 6,
        persistence: 2,
        scale: 125.0,
        seed: 1,
      },
      heightmap: {
        height: 16,
      },
      mesh: {
        wireframe: false,
      },
    };
    this.assets = assets;

    this.noise = new NoiseGenerator(this.guiParams.noise);
    this.setNoise();
    this.initializeTerrain();
    this.initializeGui();
  }

  private setNoise = () => {
    if (this.chunks) {
      Object.values(this.chunks).forEach(({ chunk }) => {
        chunk.rebuild();
      });
    }
  };

  private initializeGui = () => {
    const noiseRollup = this.gui.addFolder("Terrain.Noise");
    noiseRollup
      .add(this.guiParams.noise, "noiseType", ["simplex", "perlin", "random"])
      .onChange(this.setNoise)
      .setValue("random");
    noiseRollup
      .add(this.guiParams.noise, "scale", 64.0, 1024.0)
      .onChange(this.setNoise);
    noiseRollup
      .add(
        this.guiParams.noise,
        "octaves",
        1,

        20
      )
      .onChange(this.setNoise);
    noiseRollup
      .add(this.guiParams.noise, "persistence", 0.01, 2.0)
      .onChange(this.setNoise);
    noiseRollup
      .add(this.guiParams.noise, "lacunarity", 0.01, 4.0)
      .onChange(this.setNoise);
    noiseRollup
      .add(this.guiParams.noise, "exponentiation", 0.1, 10.0)
      .onChange(this.setNoise);
    noiseRollup
      .add(this.guiParams.noise, "height", 0, 256)
      .onChange(this.setNoise);

    const heightmapRollup = this.gui.addFolder("Terrain.Heightmap");
    heightmapRollup
      .add(this.guiParams.heightmap, "height", 0, 128)
      .onChange(this.setNoise);

    const terrainRollup = this.gui.addFolder("Terrain");
    terrainRollup.add(this.guiParams.mesh, "wireframe").onChange(() => {});
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
        subdivisions: 100,
        heightGenerators: [
          new HeightGenerator(this.noise, offset, 100000, 100000 + 1),
        ],
        minHeight: 0,
      },
      this.assets
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

export default TerrainChunkManager;

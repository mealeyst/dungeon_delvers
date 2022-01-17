import { Vector2, Vector3 } from '@babylonjs/core';

import TerrainChunk from './TerrainChunk';
import HeightGenerator from './HeightGenerator';

class TerrainChunkManager {
  constructor(params) {
    this.chunkSize = 500;
    this.Init(params);
  }

  Init(params) {
    this.InitNoise(params);
    this.InitBiomes(params);
    this.InitTerrain(params);
  }

  InitNoise(params) {
    params.guiParams.noise = {
      octaves: 6,
      persistence: 0.707,
      lacunarity: 1.8,
      exponentiation: 4.5,
      height: 300.0,
      scale: 800.0,
      noiseType: 'simplex',
      seed: 1
    };

    const onNoiseChanged = () => {
      for (let k in this.chunks) {
        this.chunks[k].chunk.Rebuild();
      }
    };

    const noiseRollup = params.gui.addFolder('Terrain.Noise');
    noiseRollup.add(params.guiParams.noise, 'noiseType', ['simplex', 'perlin', 'rand']).onChange(onNoiseChanged);
    noiseRollup.add(params.guiParams.noise, 'scale', 32.0, 4096.0).onChange(onNoiseChanged);
    noiseRollup.add(params.guiParams.noise, 'octaves', 1, 20, 1).onChange(onNoiseChanged);
    noiseRollup.add(params.guiParams.noise, 'persistence', 0.25, 1.0).onChange(onNoiseChanged);
    noiseRollup.add(params.guiParams.noise, 'lacunarity', 0.01, 4.0).onChange(onNoiseChanged);
    noiseRollup.add(params.guiParams.noise, 'exponentiation', 0.1, 10.0).onChange(onNoiseChanged);
    noiseRollup.add(params.guiParams.noise, 'height', 0, 512).onChange(onNoiseChanged);

    this.noise = new noise.Noise(params.guiParams.noise);

    params.guiParams.heightmap = {
      height: 16,
    };

    const heightmapRollup = params.gui.addFolder('Terrain.Heightmap');
    heightmapRollup.add(params.guiParams.heightmap, 'height', 0, 128).onChange(onNoiseChanged);
  }

  InitBiomes(params) {
    params.guiParams.biomes = {
      octaves: 2,
      persistence: 0.5,
      lacunarity: 2.0,
      exponentiation: 3.9,
      scale: 2048.0,
      noiseType: 'simplex',
      seed: 2,
      exponentiation: 1,
      height: 1
    };

    const onNoiseChanged = () => {
      for (let k in this.chunks) {
        this.chunks[k].chunk.Rebuild();
      }
    };

    const noiseRollup = params.gui.addFolder('Terrain.Biomes');
    noiseRollup.add(params.guiParams.biomes, 'scale', 64.0, 4096.0).onChange(onNoiseChanged);
    noiseRollup.add(params.guiParams.biomes, 'octaves', 1, 20, 1).onChange(onNoiseChanged);
    noiseRollup.add(params.guiParams.biomes, 'persistence', 0.01, 1.0).onChange(onNoiseChanged);
    noiseRollup.add(params.guiParams.biomes, 'lacunarity', 0.01, 4.0).onChange(onNoiseChanged);
    noiseRollup.add(params.guiParams.biomes, 'exponentiation', 0.1, 10.0).onChange(onNoiseChanged);

    this.biomes = new noise.Noise(params.guiParams.biomes);
  }

  InitTerrain(params) {
    params.guiParams.terrain= {
      wireframe: false,
    };
    // Need to figure out what is going on here
    // this.group = new THREE.Group()
    // this.group.rotation.x = -Math.PI / 2;
    // params.scene.add(this.group);

    const terrainRollup = params.gui.addFolder('Terrain');
    terrainRollup.add(params.guiParams.terrain, 'wireframe').onChange(() => {
      for (let k in this.chunks) {
        this.chunks[k].chunk.plane.material.wireframe = params.guiParams.terrain.wireframe;
      }
    });

    this.chunks = {};
    this.params = params;

    const w = 0;

    for (let x = -w; x <= w; x++) {
      for (let z = -w; z <= w; z++) {
        this.AddChunk(x, z);
      }
    }
  }

  Key(x, z) {
    return x + '.' + z;
  }

  AddChunk(x, z) {
    const offset = new Vector2(x * this.chunkSize, z * this.chunkSize);
    const chunk = new TerrainChunk({
      group: this.group,
      offset: new Vector3(offset.x, offset.y, 0),
      scale: 1,
      width: this.chunkSize,
      biomeGenerator: this.biomes,
      heightGenerators: [new HeightGenerator(this.noise, offset, 100000, 100000 + 1)],
    });

    const k = this.Key(x, z);
    const edges = [];
    for (let xi = -1; xi <= 1; xi++) {
      for (let zi = -1; zi <= 1; zi++) {
        if (xi == 0 || zi == 0) {
          continue;
        }
        edges.push(this.Key(x + xi, z + zi));
      }
    }

    this.chunks[k] = {
      chunk: chunk,
      edges: edges
    };
  }
}

export default TerrainChunkManager;

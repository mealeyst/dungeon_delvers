import { perlin2D } from "./Perlin";
import SimplexNoise from "simplex-noise";
import RandomWrapper from "./Random";

type NoiseParams = {
  noiseType: string;
  scale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
  exponentiation: number;
  height: number;
  seed: number;
};

class NoiseGenerator {
  params: NoiseParams;

  noise: any;

  constructor(params: NoiseParams) {
    this.params = params;
    this.Init();
  }

  Init() {
    this.noise = {
      simplex: new SimplexNoise(this.params.seed),
      perlin: {
        noise2D: (x: number, y: number) => {
          return perlin2D(x, y);
        },
      },
      random: new RandomWrapper(),
    };
  }

  Get(x: number, y: number) {
    const xs = x / this.params.scale;
    const ys = y / this.params.scale;
    const noiseFunc = this.noise[this.params.noiseType];
    const G = 2.0 ** -this.params.persistence;
    let amplitude = 1.0;
    let frequency = 1.0;
    let normalization = 0;
    let total = 0;
    for (let o = 0; o < this.params.octaves; o += 1) {
      const noiseValue =
        noiseFunc.noise2D(xs * frequency, ys * frequency) * 0.5 + 0.5;
      total += noiseValue * amplitude;
      normalization += amplitude;
      amplitude *= G;
      frequency *= this.params.lacunarity;
    }
    total /= normalization;
    return total ** this.params.exponentiation * this.params.height;
  }
}

export default NoiseGenerator;

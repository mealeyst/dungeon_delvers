"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Perlin_1 = require("./Perlin");
const simplex_noise_1 = require("simplex-noise");
const alea_1 = __importDefault(require("alea"));
const Random_1 = __importDefault(require("./Random"));
class NoiseGenerator {
    constructor(params) {
        this.params = params;
        this.Init();
    }
    Init() {
        this.noise = {
            simplex: {
                noise2D: (x, y) => {
                    const noise2D = (0, simplex_noise_1.createNoise2D)((0, alea_1.default)(this.params.seed));
                    return noise2D(x, y);
                },
            },
            perlin: {
                noise2D: (x, y) => {
                    return (0, Perlin_1.perlin2D)(x, y);
                },
            },
            random: new Random_1.default(),
        };
    }
    Get(x, y) {
        const xs = x / this.params.scale;
        const ys = y / this.params.scale;
        const noiseFunc = this.noise[this.params.noiseType];
        const G = 2.0 ** -this.params.persistence;
        let amplitude = 1.0;
        let frequency = 1.0;
        let normalization = 0;
        let total = 0;
        for (let o = 0; o < this.params.octaves; o += 1) {
            const noiseValue = noiseFunc.noise2D(xs * frequency, ys * frequency) * 0.5 + 0.5;
            total += noiseValue * amplitude;
            normalization += amplitude;
            amplitude *= G;
            frequency *= this.params.lacunarity;
        }
        total /= normalization;
        return total ** this.params.exponentiation * this.params.height;
    }
}
exports.default = NoiseGenerator;
//# sourceMappingURL=index.js.map
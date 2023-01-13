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
declare class NoiseGenerator {
    params: NoiseParams;
    noise: any;
    constructor(params: NoiseParams);
    Init(): void;
    Get(x: number, y: number): number;
}
export default NoiseGenerator;
//# sourceMappingURL=index.d.ts.map
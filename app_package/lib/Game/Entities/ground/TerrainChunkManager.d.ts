import { Scene } from "@babylonjs/core";
import { GUI } from "dat.gui";
import NoiseGenerator from "../../../utils/noise";
import { Assets } from "../../Assets";
import TerrainChunk from "./TerrainChunk";
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
declare class TerrainChunkManager {
    assets: Assets;
    chunks: Record<string, Chunk> | {};
    chunkSize: number;
    gui: GUI;
    guiParams: TerrainChunkManagerGuiInterface;
    noise: NoiseGenerator;
    scene: Scene;
    constructor(gui: GUI, scene: Scene, assets: Assets);
    private setNoise;
    private initializeGui;
    static key: (x: number, z: number) => string;
    private addChunk;
    private initializeTerrain;
}
export default TerrainChunkManager;
//# sourceMappingURL=TerrainChunkManager.d.ts.map
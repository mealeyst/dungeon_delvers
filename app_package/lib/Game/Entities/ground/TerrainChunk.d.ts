import { Mesh, Scene, Vector3 } from "@babylonjs/core";
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
declare class TerrainChunk {
    assets: Assets;
    chunk: Mesh;
    chunkParams: TerrainChunkInterface;
    private scene;
    constructor(scene: Scene, chunkParams: TerrainChunkInterface, assets: Assets);
    rebuild: () => void;
}
export default TerrainChunk;
//# sourceMappingURL=TerrainChunk.d.ts.map
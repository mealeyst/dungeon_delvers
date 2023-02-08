import { GroundMesh, Scene, Vector3 } from "@babylonjs/core";
import { DungeonGenerator } from "./DungeonGenerator";
export declare class Room {
    _floor: GroundMesh;
    radius: number;
    position: Vector3;
    constructor(name: string, scene: Scene, parent: DungeonGenerator, meshes: Room[]);
}
//# sourceMappingURL=Room.d.ts.map
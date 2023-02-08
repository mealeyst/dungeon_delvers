import { GroundMesh } from "@babylonjs/core";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";
export declare class DungeonGenerator extends TransformNode {
    _meshes: GroundMesh[];
    constructor(name: string, scene: Scene);
    private getRandomPointInCircle;
}
//# sourceMappingURL=index.d.ts.map
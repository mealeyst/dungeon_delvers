import { Scene } from "@babylonjs/core";
import { Assets } from "../Assets";
import { InputManager } from "../Inputs/InputManager";
export declare class PlayerManager {
    private scene;
    private camera;
    private player;
    constructor(assets: Assets, inputManager: InputManager, scene: Scene);
    private _setupPlayerCamera;
}
//# sourceMappingURL=PlayerManager.d.ts.map
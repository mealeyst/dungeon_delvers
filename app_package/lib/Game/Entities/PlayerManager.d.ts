import { Nullable, Scene, FollowCamera } from "@babylonjs/core";
import { Assets } from "../Assets";
import { InputManager } from "../Inputs/InputManager";
export declare class PlayerManager {
    private scene;
    private camera;
    private _camRoot;
    private player;
    private _yTilt;
    private static readonly ORIGINAL_TILT;
    constructor(assets: Assets, camera: Nullable<FollowCamera>, inputManager: InputManager, scene: Scene);
    private _setupPlayerCamera;
}
//# sourceMappingURL=PlayerManager.d.ts.map
import { AbstractMesh, CubeTexture, Nullable, Scene } from "@babylonjs/core";
export declare class Assets {
    assetsHostUrl: string;
    PlaceHolderChar: Nullable<AbstractMesh>;
    envCube: CubeTexture;
    constructor(scene: Scene, assetsHostUrl: string, onReady: (assets: Assets) => void, onLoadComplete: (assets: Assets) => void);
}
//# sourceMappingURL=Assets.d.ts.map
import { AbstractMesh, Nullable, Scene, Texture } from "@babylonjs/core";
export declare class Assets {
    assetsHostUrl: string;
    placeHolderChar: Nullable<AbstractMesh>;
    groundTexture: Nullable<Texture>;
    constructor(scene: Scene, assetsHostUrl: string, onReady: (assets: Assets) => void);
}
//# sourceMappingURL=Assets.d.ts.map
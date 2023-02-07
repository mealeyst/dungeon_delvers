import { AbstractMesh, CubeTexture, Nullable, Scene, Texture } from "@babylonjs/core";
export declare class Assets {
    assetsHostUrl: string;
    placeHolderChar: Nullable<AbstractMesh>;
    groundTexture: Nullable<Texture>;
    starboxTexture: Nullable<CubeTexture>;
    constructor(scene: Scene, assetsHostUrl: string, onReady: (assets: Assets) => void);
}
//# sourceMappingURL=Assets.d.ts.map
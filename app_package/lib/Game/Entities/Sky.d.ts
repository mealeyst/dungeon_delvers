import { HemisphericLight, Scene, Vector3 } from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";
import { GUI } from "dat.gui";
interface SkyGuiInterface {
    sky: {
        luminance: number;
        turbidity: number;
        rayleigh: number;
        mieCoefficient: number;
        mieDirectionalG: number;
    };
    sun: {
        inclination: number;
        azimuth: number;
    };
}
declare class Sky {
    gui: GUI;
    guiParams: SkyGuiInterface;
    light: HemisphericLight;
    scene: Scene;
    skybox: any;
    skyMaterial: SkyMaterial;
    sunPosition: Vector3;
    constructor(gui: GUI, scene: Scene);
    private setSky;
    private setSun;
    private initializeGui;
}
export default Sky;
//# sourceMappingURL=Sky.d.ts.map
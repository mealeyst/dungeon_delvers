import { HemisphericLight, Mesh, Nullable, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { SkyMaterial } from "@babylonjs/materials";
import { Assets } from "../Assets";
type SkyMaterialOptions = {
    sky: {
        luminance?: number;
        turbidity?: number;
        rayleigh?: number;
    };
    sun: {
        inclination?: number;
        azimuth?: number;
    };
};
declare class Sky extends TransformNode {
    _azimuth: number;
    _inclination: number;
    _light: HemisphericLight;
    _luminance: number;
    _rayleigh: number;
    _skybox: Mesh;
    _starbox: Mesh;
    _skyMaterial: SkyMaterial;
    _starMaterial: Nullable<StandardMaterial>;
    _sunPosition: Vector3;
    _turbidity: number;
    constructor(name: string, scene: Scene, assets: Assets, options?: SkyMaterialOptions);
    set azimuth(value: number);
    get azimuth(): number;
    set inclination(value: number);
    get inclination(): number;
    set rayleigh(value: number);
    get rayleigh(): number;
    set turbidity(value: number);
    get turbidity(): number;
    set luminance(value: number);
    get luminance(): number;
}
export default Sky;
//# sourceMappingURL=Sky.d.ts.map
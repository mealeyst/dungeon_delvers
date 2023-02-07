import { HemisphericLight, Mesh, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";
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
    _skyMaterial: SkyMaterial;
    _sunPosition: Vector3;
    _turbidity: number;
    constructor(name: string, scene: Scene, options?: SkyMaterialOptions);
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
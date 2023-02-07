import {
  Color3,
  CubeTexture,
  HemisphericLight,
  InspectableType,
  Mesh,
  MeshBuilder,
  Nullable,
  Scene,
  Texture,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { MultiMaterial } from "@babylonjs/core/Materials/multiMaterial";
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

class Sky extends TransformNode {
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

  constructor(
    name: string,
    scene: Scene,
    assets: Assets,
    options?: SkyMaterialOptions
  ) {
    super(name, scene);
    const defualtSkyOptions = {
      sky: {
        luminance: 0.2,
        rayleigh: 0.4,
        turbidity: 1,
      },
      sun: {
        inclination: 0.0,
        azimuth: 0.25,
      },
    };

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    this._sunPosition = new Vector3(0, 100, 0);
    this._light = new HemisphericLight("light", this._sunPosition, scene);

    this._azimuth = options?.sun?.azimuth || defualtSkyOptions?.sun.azimuth;
    this._inclination =
      options?.sun?.inclination || defualtSkyOptions?.sun.inclination;
    this._luminance =
      options?.sky?.luminance || defualtSkyOptions?.sky.luminance;
    this._rayleigh = options?.sky?.rayleigh || defualtSkyOptions?.sky.rayleigh;
    this._turbidity =
      options?.sky?.turbidity || defualtSkyOptions?.sky.turbidity;
    // Default intensity is 1. Let's dim the light a small amount
    this._light.intensity = 0.7;

    this._skyMaterial = new SkyMaterial("skyMaterial", scene);
    this._skyMaterial.backFaceCulling = false;
    this._skyMaterial.alpha = 0.9;
    this._skyMaterial.alphaMode = 1;
    this._starbox = MeshBuilder.CreateBox("starBox", { size: 1000.0 }, scene);
    this._starbox.parent = this;
    this._starMaterial = null;
    if (assets.starboxTexture !== null) {
      this._starMaterial = new StandardMaterial("starMaterial", scene);
      this._starMaterial.reflectionTexture = assets.starboxTexture;
      this._starMaterial.reflectionTexture.coordinatesMode =
        Texture.SKYBOX_MODE;
      this._starMaterial.backFaceCulling = false;
      this._starMaterial.diffuseColor = new Color3(0, 0, 0);
      this._starMaterial.specularColor = new Color3(0, 0, 0);
      this._starMaterial.disableLighting = false;
      this._starbox.material = this._starMaterial;
    }
    this._skybox = MeshBuilder.CreateBox("skyBox", { size: 999.9 }, scene);
    this._skybox.parent = this;
    this._skybox.material = this._skyMaterial;
    // Custom inspector properties.
    this.inspectableCustomProperties = [
      {
        label: "Sky Options",
        propertyName: "sky",
        type: InspectableType.Tab,
      },
      {
        label: "Luminance",
        propertyName: "luminence",
        type: InspectableType.Slider,
        min: 0.0,
        max: 1.0,
        step: 0.1,
      },
      {
        label: "Rayleigh",
        propertyName: "rayleigh",
        type: InspectableType.Slider,
        min: 0.0,
        max: 2.0,
        step: 0.1,
      },
      {
        label: "Turbidity",
        propertyName: "turbidity",
        type: InspectableType.Slider,
        min: 0,
        max: 20,
        step: 1,
      },
      {
        label: "Sun Options",
        propertyName: "sun",
        type: InspectableType.Tab,
      },
      {
        label: "azimuth",
        propertyName: "azimuth",
        type: InspectableType.Slider,
        min: 0.0,
        max: 1.0,
        step: 0.1,
      },
      {
        label: "Inclination",
        propertyName: "inclination",
        type: InspectableType.Slider,
        min: -1.0,
        max: 1.0,
        step: 0.1,
      },
    ];
    let alpha = 1;
    scene.onBeforeRenderObservable.add(() => {
      this._inclination = Math.cos(alpha);
      this._skyMaterial.inclination = Math.cos(alpha);
      this._starbox.visibility = Math.min(Math.max(Math.sin(alpha), 0), 1);
      console.log();
      alpha = alpha < 3 ? alpha + 0.0001 : 0;
    });
  }

  set azimuth(value: number) {
    this._azimuth = value;
    this._skyMaterial.azimuth = value;
  }

  get azimuth() {
    return this._azimuth;
  }

  set inclination(value: number) {
    this._inclination = value;
    this._skyMaterial.inclination = value;
  }

  get inclination() {
    return this._inclination;
  }

  set rayleigh(value: number) {
    this._rayleigh = value;
    this._skyMaterial.rayleigh = value;
  }

  get rayleigh() {
    return this._rayleigh;
  }

  set turbidity(value: number) {
    this._turbidity = value;
    this._skyMaterial.turbidity = value;
  }

  get turbidity() {
    return this._turbidity;
  }

  set luminance(value: number) {
    this._luminance = value;
    this._skyMaterial.luminance = value;
  }

  get luminance() {
    return this._luminance;
  }
}

export default Sky;

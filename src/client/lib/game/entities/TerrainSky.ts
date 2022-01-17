import {
  HemisphericLight,
  Mesh,
  Scene,
  Vector3,
} from '@babylonjs/core';
import { SkyMaterial } from '@babylonjs/materials';
import { GUI } from 'dat.gui';
import { Entity } from './Entity.d';

interface TerrainGuiInterface {
       sky: {
          luminance: number;
          turbidity: number;
          rayleigh: number;
          mieCoefficient: number;
          mieDirectionalG: number;
       }
       sun: {
          inclination: number;
          azimuth: number;
       }

}

class TerrainSky implements Entity {
  gui: GUI;

  guiParams: TerrainGuiInterface;

  light: HemisphericLight;

  scene: Scene;

  skybox: any;

  skyMaterial: SkyMaterial;

  sunPosition: Vector3;

  constructor(scene: Scene, gui: GUI, guiParams: any) {
    this.scene = scene;
    this.gui = gui;
    this.guiParams = guiParams;
    this.guiParams = {
      sky: {
        luminance: 0.2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        rayleigh: 2,
        turbidity: 1,
      },
      sun: {
        inclination: 0.2,
        azimuth: 0.25,
      },
    };
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    this.sunPosition = new Vector3(0, 100, 0);
    this.light = new HemisphericLight('light', this.sunPosition, this.scene);

    // Default intensity is 1. Let's dim the light a small amount
    this.light.intensity = 0.7;

    this.skyMaterial = new SkyMaterial('skyMaterial', this.scene);
    this.skyMaterial.backFaceCulling = false;
    this.skybox = Mesh.CreateBox('skyBox', 1000.0, this.scene);
    this.setSky();
    this.setSun();
    this.initializeGui();
  }

  private setSky = () => {
    this.skyMaterial.turbidity = this.guiParams.sky.turbidity;
    this.skyMaterial.rayleigh = this.guiParams.sky.rayleigh;
    this.skyMaterial.luminance = this.guiParams.sky.luminance;
    this.skybox.material = this.skyMaterial;
  };

  private setSun = () => {
    this.skyMaterial.inclination = this.guiParams.sun.inclination;
    this.skyMaterial.azimuth = this.guiParams.sun.azimuth;
  };

  private initializeGui = () => {
    const skyRollup = this.gui.addFolder('Sky');
    skyRollup.add(this.guiParams.sky, 'turbidity', 0, 20).onChange(this.setSky);
    skyRollup.add(this.guiParams.sky, 'rayleigh', 0.0, 2.0).onChange(this.setSky);
    skyRollup.add(this.guiParams.sky, 'luminance', 0.0, 1.0).onChange(this.setSky);
    const sunRollup = this.gui.addFolder('Sun');
    sunRollup.add(this.guiParams.sun, 'inclination', 0.0, 1.0).onChange(this.setSun);
    sunRollup.add(this.guiParams.sun, 'azimuth', 0.0, 1).onChange(this.setSun);
  };
}

export default TerrainSky;

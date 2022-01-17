import {
  Vector3,
  FreeCamera,
} from '@babylonjs/core';
import { GUI } from 'dat.gui';
import TerrainSky from './entities/TerrainSky';

export class ProceduralTerrainDemo {
  camera: any;

  canvas: any;

  entities: any;

  gui: any;

  scene: any;

  constructor(scene:any) {
    this.scene = scene;
    this.canvas = this.scene.getEngine().getRenderingCanvas();
    this.entities = {};
    this.initializeGui();
    this.entities.skybox = new TerrainSky(this.scene, this.gui, {});
    this.initializeCamera();
  }

  private initializeCamera = () => {
    // This creates and positions a free camera (non-mesh)
    this.camera = new FreeCamera('camera1', new Vector3(0, 5, -10), this.scene);
    // This targets the camera to scene origin
    this.camera.setTarget(Vector3.Zero());
    // This attaches the camera to the canvas
    this.camera.attachControl(this.canvas, true);
  };

  private initializeGui = () => {
    this.gui = new GUI();
    this.gui.addFolder('General');
  };
}

export default (scene: any) => { return new ProceduralTerrainDemo(scene); };

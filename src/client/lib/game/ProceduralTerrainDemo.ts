import {
  Vector3,
  FreeCamera,
} from '@babylonjs/core';
import { GUI } from 'dat.gui';
import TerrainChunkManager from './entities/ground/TerrainChunkManager';
import TerrainSky from './entities/sky/TerrainSky';

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
    this.entities.terrain = new TerrainChunkManager(this.gui, this.scene);
    this.entities.skybox = new TerrainSky(this.gui, this.scene);
    this.initializeCamera();
  }

  private initializeCamera = () => {
    // This creates and positions a free camera (non-mesh)
    this.camera = new FreeCamera('camera1', new Vector3(-46.164, 13.312, 42.000), this.scene);
    // This targets the camera to scene origin
    this.camera.setTarget(new Vector3(11.268, -12.038, -10.484));
    // This attaches the camera to the canvas
    this.camera.attachControl(this.canvas, true);
    
  };

  private initializeGui = () => {
    this.gui = new GUI();
    this.gui.addFolder('General');
  };
}

export default (scene: any) => { return new ProceduralTerrainDemo(scene); };

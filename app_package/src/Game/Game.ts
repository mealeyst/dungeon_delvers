import {
  CannonJSPlugin,
  Color3,
  DirectionalLight,
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/inspector";
import { GUI } from "dat.gui";
import { Assets } from "./Assets";
import Sky from "./entities/Sky";
import TerrainChunkManager from "./entities/ground/TerrainChunkManager";
import { InputManager } from "./Inputs/InputManager";
import { PlayerManager } from "./entities/PlayerManager";

class Game {
  gui: GUI;
  scene: Scene;
  private _inputManager: InputManager | null;
  constructor(
    engine: Engine,
    assetsHostUrl: string,
    canvas: HTMLCanvasElement
  ) {
    this._inputManager = null;
    this.scene = new Scene(engine);
    this.scene.debugLayer.show();
    // scene.clearColor = new Color4(0, 0, 0, 1);
    // scene.autoClearDepthAndStencil = false;
    // scene.skipPointerMovePicking = true;
    // scene.pointerUpPredicate = () => false;
    // scene.pointerDownPredicate = () => false;
    // scene.pointerMovePredicate = () => false;

    // lighting
    const dirLight = new DirectionalLight(
      "dirLight",
      new Vector3(0.47, -0.19, -0.86),
      this.scene
    );
    dirLight.diffuse = Color3.FromInts(255, 251, 199);
    dirLight.intensity = 1.5;

    // This creates and positions a free camera (non-mesh)
    var camera = new ArcRotateCamera(
      "playerCamera",
      Math.PI / 2,
      Math.PI / 2,
      5,
      new Vector3(0, 2, -5),
      this.scene
    );
    this.scene.addCamera(camera)
    // this.scene.activeCamera = camera;
    // this.scene.activeCamera.attachControl(canvas, true);
    // camera.lowerRadiusLimit = 2;
    // camera.upperRadiusLimit = 10;
    // camera.wheelDeltaPercentage = 0.01;
    const gravityVector = new Vector3(0, -9.81, 0);
    const physicsPlugin = new CannonJSPlugin();
    this.scene.enablePhysics(gravityVector, physicsPlugin);
    this.gui = this.initializeGui();
    new Assets(this.scene, assetsHostUrl, (assets) => {
      new Sky(this.gui, this.scene);
      new TerrainChunkManager(this.gui, this.scene, assets);
      this._inputManager = new InputManager(this.scene, assets);
      console.log(this._inputManager);
      new PlayerManager( assets, this._inputManager, this.scene);
    });
  }
  private initializeGui = () => {
    const gui = new GUI();
    return gui;
  };

  public getScene() {
    return this.scene;
  }
}

export function CreateGameScene(
  engine: Engine,
  assetsHostUrl: string,
  canvas: HTMLCanvasElement
): Scene {
  const game = new Game(engine, assetsHostUrl, canvas);
  return game.getScene();
}

import {
  CannonJSPlugin,
  Color3,
  DirectionalLight,
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
} from "@babylonjs/core";
import "@babylonjs/inspector";
import { Assets } from "./Assets";
import Sky from "./entities/Sky";
import TerrainChunkManager from "./entities/ground/TerrainChunkManager";
import { InputManager } from "./Inputs/InputManager";
import { PlayerManager } from "./entities/PlayerManager";
import { DungeonGenerator } from "./entities/ground/DungeonGenerator/index";
import { binarySpacePartition } from "./entities/ground/DungeonGenerator/BinarySpacePartition";

console.log(typeof binarySpacePartition);

class Game {
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
    // const dirLight = new DirectionalLight(
    //   "dirLight",
    //   new Vector3(10, 10, -0.86),
    //   this.scene
    // );
    // dirLight.diffuse = Color3.FromInts(255, 251, 199);
    // dirLight.intensity = 1.5;
    const sunPosition = new Vector3(0, 100, 0);
    const light = new HemisphericLight("light", sunPosition, this.scene);

    // This creates and positions a free camera (non-mesh)
    var camera = new ArcRotateCamera(
      "playerCamera",
      Math.PI / 2,
      Math.PI / 2,
      5,
      new Vector3(0, 2, -5),
      this.scene
    );
    this.scene.addCamera(camera);
    this.scene.activeCamera = camera;
    this.scene.activeCamera.attachControl(canvas, true);
    // camera.lowerRadiusLimit = 2;
    // camera.upperRadiusLimit = 10;
    // camera.wheelDeltaPercentage = 0.01;
    const gravityVector = new Vector3(0, -9.81, 0);
    this.scene.collisionsEnabled = true;
    const physicsPlugin = new CannonJSPlugin();
    this.scene.enablePhysics(gravityVector, physicsPlugin);
    new Assets(this.scene, assetsHostUrl, (assets) => {
      // new Sky("sky", this.scene, assets);
      // new TerrainChunkManager(this.gui, this.scene, assets);
      // this._inputManager = new InputManager(this.scene, assets);
      // new PlayerManager(assets, this._inputManager, this.scene);
      // new DungeonGenerator("dungeon", this.scene);
      binarySpacePartition(1000, 1000);
    });
  }

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

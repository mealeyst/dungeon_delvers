import {
  CannonJSPlugin,
  Color3,
  DirectionalLight,
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";
import "@babylonjs/inspector";
import { Assets } from "./Assets";
import Sky from "./entities/Sky";
import TerrainChunkManager from "./entities/ground/TerrainChunkManager";
import { InputManager } from "./Inputs/InputManager";
import { PlayerManager } from "./entities/PlayerManager";
import { Dungeon } from "./entities/generators/Dungeon";

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
      new Dungeon("dungeon", this.scene);
      // new Sky("sky", this.scene, assets);
      // new TerrainChunkManager(this.gui, this.scene, assets);
      // this._inputManager = new InputManager(this.scene, assets);
      // new PlayerManager(assets, this._inputManager, this.scene);
      // const floor = MeshBuilder.CreateGround("floor", {
      //   height: Math.floor(Math.random() * 30) + 20,
      //   width: Math.floor(Math.random() * 30) + 20,
      //   subdivisions: 4,
      // });
      // floor.setPivotPoint(new Vector3(floor._width / 2, 0, floor._height / 2));
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

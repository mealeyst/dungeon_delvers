import {
  Color3,
  Color4,
  DirectionalLight,
  Engine,
  Scene,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/inspector";
import { GUI, GUIController } from "dat.gui";
import { Assets } from "./Assets";
import Sky from "./entities/Sky";
import TerrainChunkManager from "./entities/ground/TerrainChunkManager";

class Game {
  gui: GUI;
  scene: Scene;
  constructor(
    engine: Engine,
    assetsHostUrl: string,
    canvas: HTMLCanvasElement
  ) {
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
    var camera = new UniversalCamera(
      "camera1",
      new Vector3(0, 2, -5),
      this.scene
    );
    this.gui = this.initializeGui();
    new Assets(
      this.scene,
      assetsHostUrl,
      (assets) => {
        new Sky(this.gui, this.scene);
        new TerrainChunkManager(this.gui, this.scene, assets);
        console.log("onReady", assets);
      },
      (assets) => {
        console.log("onReady", assets);
      }
    );
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

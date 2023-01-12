import * as BABYLON from "@babylonjs/core";
import { BouncingBallScene } from "./BouncingBallScene";

class Game {
  public static CreateScene(
    engine: BABYLON.Engine,
    assetsHostUrl: string,
    canvas: HTMLCanvasElement
  ): BABYLON.Scene {
    let scene = new BouncingBallScene(engine);

    return scene;
  }
}

export function CreateGameScene(
  engine: BABYLON.Engine,
  assetsHostUrl: string,
  canvas: HTMLCanvasElement
): BABYLON.Scene {
  return Game.CreateScene(engine, assetsHostUrl, canvas);
}

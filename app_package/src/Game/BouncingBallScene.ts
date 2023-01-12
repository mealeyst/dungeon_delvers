import { Engine, Mesh, Scene } from "@babylonjs/core";
import { BouncingBall } from "./BouncingBall";

export class BouncingBallScene extends Scene {
  constructor(engine: Engine) {
    super(engine);
    new BouncingBall(this);
    Mesh.CreateGround("ground1", 6, 6, 2, this);
    this.createDefaultCameraOrLight();
  }
}

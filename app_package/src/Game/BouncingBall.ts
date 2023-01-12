import { Mesh, Scene, TransformNode } from "@babylonjs/core";

export class BouncingBall extends TransformNode {
  private _sphere: Mesh;
  constructor(scene: Scene) {
    super("bouncingBall", scene);
    this._sphere = Mesh.CreateSphere("sphere", 16, 2, scene);
    this._sphere.setParent(this);

    this.position.y = 1;

    scene.onBeforeRenderObservable.runCoroutineAsync(this._bounceCoroutine());
  }

  private *_bounceCoroutine() {
    for (let frameCount = 0; true; ++frameCount) {
      this._sphere.position.y = 1 + 2 * Math.abs(Math.sin(frameCount / 16));
      yield;
    }
  }
}

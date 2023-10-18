import { MeshBuilder, Scene, Vector3 } from '@babylonjs/core'

export class Stage {
  private _scene: Scene
  constructor(scene: Scene) {
    this._scene = scene
  }

  public async load() {
    const ground = MeshBuilder.CreateGround(
      'ground',
      { width: 24, height: 24 },
      this._scene,
    )
    ground.scaling = new Vector3(1, 0.02, 1)
  }
}

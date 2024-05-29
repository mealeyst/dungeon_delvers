import {
  AnimationGroup,
  FollowCamera,
  Mesh,
  Scene,
  Vector3,
} from '@babylonjs/core'
import { PlayerInput } from '../core/inputController'

export class Player {
  private _animations: AnimationGroup[]
  private _canvas: HTMLCanvasElement
  private _mesh: Mesh
  private _scene: Scene
  constructor(scene: Scene, input: PlayerInput) {
    this._canvas = scene.getEngine().getRenderingCanvas() as HTMLCanvasElement
    this._scene = scene
    this.load()
  }
  async load() {
    // const playerCamera = new FollowCamera(
    //   'playerCamera',
    //   new Vector3(0, 10, -10),
    //   this._scene,
    // )
    // this._scene.cameras.forEach(camera => {
    //   camera.detachControl()
    // })
    // this._scene.activeCamera = playerCamera
    // this._scene.activeCamera.attachControl(this._canvas, true)
  }
}

import {
  Color4,
  Engine,
  FollowCamera,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  SceneLoader,
  Vector3,
} from '@babylonjs/core'
import { AdvancedDynamicTexture, Control, StackPanel } from '@babylonjs/gui'

type MenuActions = Record<string, () => void>

export class FullScreenMenu {
  private _advancedTexture: AdvancedDynamicTexture
  private _canvas: HTMLCanvasElement
  private _engine: Engine
  private _scene: Scene
  private _controls: Control[]
  private _menuName: string
  private _camera: FollowCamera

  constructor(
    canvas: HTMLCanvasElement,
    engine: Engine,
    menuName: string,
    color: Color4,
    oldScene: Scene,
  ) {
    this._menuName = menuName
    this._canvas = canvas
    this._engine = engine
    this._engine.displayLoadingUI()
    this.scene = new Scene(engine)
    this.scene.clearColor = color
    this._advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      this._menuName,
      true,
      this._scene,
    )
    this._initMenu()
    this._engine.hideLoadingUI()
    oldScene.dispose()
  }
  private async _initMenu() {
    const light0 = new HemisphericLight(
      'HemiLight',
      new Vector3(0, 5, 0),
      this._scene,
    )

    this._camera = new FollowCamera(
      `${this._menuName}_camera`,
      new Vector3(0, 5, -5),
      this._scene,
    )

    await this._scene.whenReadyAsync()
  }

  get menu(): AdvancedDynamicTexture {
    return this._advancedTexture
  }

  set menu(advancedTexture: AdvancedDynamicTexture) {
    this._advancedTexture = advancedTexture
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas
  }

  set canvas(canvas: HTMLCanvasElement) {
    this._canvas = canvas
  }

  get scene(): Scene {
    return this._scene
  }

  set scene(scene: Scene) {
    this._scene = scene
  }

  get camera(): FollowCamera {
    return this._camera
  }

  set camera(camera: FollowCamera) {
    this._camera = camera
  }
}

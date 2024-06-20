import {
  AbstractMesh,
  AnimationGroup,
  Color3,
  FollowCamera,
  MeshBuilder,
  Ray,
  RayHelper,
  Scene,
  TransformNode,
  Vector3,
} from '@babylonjs/core'
import { InputManager } from '../core/inputManager'

export class Player extends TransformNode {
  private _mesh: AbstractMesh
  public _scene: Scene
  private _input: InputManager
  private _forwardSpeed: number = 0.08
  private _backwardSpeed: number = this._forwardSpeed * 0.5
  private _turnSpeed: number = 0.2
  private _rays: { ray: Ray, helper: RayHelper }[] = []
  private _grounded: boolean = true

  constructor(scene: Scene) {
    super('player', scene)
    this._scene = scene
    this._input = new InputManager(scene)
    for (let i = 0; i < 4; i++) {
      const ray = new Ray(Vector3.Zero(), Vector3.Zero(), 2)
      const helper = new RayHelper(ray)
      this._rays.push({ ray, helper })
    }
    this.load()
    this._scene.onBeforeRenderObservable.add(() => {
      this._beforeRenderUpdate()
    })
  }
  async load() {
    this._mesh = MeshBuilder.CreateCapsule('player', {
      height: 2.5,
      radius: 0.5,
    })
    const playerCamera = new FollowCamera(
      'playerCamera',
      new Vector3(0, 10, 5),
      this._scene,
      this._mesh,
    )
    playerCamera.rotationOffset = 180
    this._mesh.rotation.y = 0
    this._mesh.position.y = 1.25 // Move capsule up to be on the ground
    this._rays.forEach(({ helper }, rayIndex) => {
      helper.attachToMesh(
        this._mesh,
        new Vector3(
          rayIndex <= 1 ? -1 : 1,
          -0.98,
          rayIndex % 2 === 0 ? 0.7 : -0.7,
        ),
        new Vector3(rayIndex <= 1 ? -0.45 : 0.45, -0.2, rayIndex % 2 === 0 ? 0.25 : -0.25),
        1.25
      )
      helper.show(
        this._scene,
        new Color3(
          rayIndex <= 1 ? 0 : 1,
          rayIndex % 2 === 0 ? 0 : 1,
          0
        )
      )
    });
    this._scene.activeCamera = playerCamera
    playerCamera.attachControl()

  }

  private _beforeRenderUpdate() {
    this._update()
  }
  private _update() {
    //Manage the movements of the character (e.g. position, direction)
    this._rays.forEach(({ ray }) => {
      const pick = this._scene.pickWithRay(ray)
      if (pick && pick.hit) {
        this._grounded = true
      }
    })
    if (this._input.inputMap['w']) {
      this._mesh.moveWithCollisions(
        this._mesh.forward.scaleInPlace(this._forwardSpeed),
      )
    }
    if (this._input.inputMap['s']) {
      this._mesh.moveWithCollisions(
        this._mesh.forward.scaleInPlace(-this._backwardSpeed),
      )

    }
    if (this._input.inputMap['a']) {
      this._mesh.rotate(Vector3.Up(), -this._turnSpeed)

    }
    if (this._input.inputMap['d']) {
      this._mesh.rotate(Vector3.Up(), this._turnSpeed)

    }
    if (this._input.inputMap[' ']) {
      this._grounded = false
      this._mesh.moveWithCollisions(new Vector3(0, 0.1, 0))
    }
  }
}

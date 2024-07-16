import {
  Animation,
  AbstractMesh,
  ArcRotateCamera,
  Color3,
  Color4,
  FollowCamera,
  GroundMesh,
  Mesh,
  MeshBuilder,
  Ray,
  RayHelper,
  Scene,
  SceneLoader,
  StandardMaterial,
  TransformNode,
  Vector3,
} from '@babylonjs/core'
import { InputManager } from '../../core/inputManager'
import { AdvancedDynamicTexture, TextBlock } from '@babylonjs/gui'
import { clamp } from '../../core/math'

export class Actor extends TransformNode {
  private _mesh: AbstractMesh
  public _scene: Scene
  private _input: InputManager
  private _forwardSpeed: number = 0.08
  private _forwardSpeedMultiplier: number = 0.001
  private _backwardSpeed: number = this._forwardSpeed * 0.5
  private _turnSpeed: number = Math.PI / 10
  private _height: number = 1.8
  private _grounded: boolean = true
  private _angle: number = 0
  private _camera: ArcRotateCamera
  private _frontRay: Ray
  private _bottomRay: Ray
  private _selected: boolean = false
  private _jumpTime: number = 0
  private _gravity: Vector3 = new Vector3(0, -9.8, 0)
  private _labelTexture: AdvancedDynamicTexture
  private _labelText: TextBlock
  private _startPosition: Vector3
  constructor(scene: Scene) {
    super('player', scene)
    this._scene = scene
    this._input = new InputManager(scene)
    this.load()
    this._scene.onBeforeRenderObservable.add(() => {
      this._beforeRenderUpdate()
      this._mesh.moveWithCollisions(new Vector3(0, -0.1, 0))
    })
  }
  async load() {
    SceneLoader.ImportMesh("", "public/assets/models/", "Vincent.babylon", this._scene, (meshes, particleSystems, skeletons) => {
      let player = meshes[0];
      let skeleton = skeletons[0];
      player.skeleton = skeleton;

      skeleton.enableBlending(0.1);
      //if the skeleton does not have any animation ranges then set them as below
      // setAnimationRanges(skeleton);

      let sm = <StandardMaterial>player.material;
      if (sm.diffuseTexture != null) {
        sm.backFaceCulling = true;
        sm.ambientColor = new Color3(1, 1, 1);
      }


      player.position = new Vector3(0, 40, 0);
      player.checkCollisions = true;
    })
    this._mesh = MeshBuilder.CreateCapsule('player', {
      height: this._height,
      radius: 0.35,
    })
    this._mesh.position.y = 0.985
    this._mesh.position.z = 20
    this._mesh.isPickable = false
    this._frontRay = new Ray(this._mesh.position, new Vector3(0, 0, -1), 1)
    const frontRayHelper = new RayHelper(this._frontRay)
    frontRayHelper.show(this._scene, new Color3(1, 0, 0))

    this._bottomRay = new Ray(this._mesh.position, new Vector3(0, -1, 0), this._height/2 + 0.2)
    const bottomRayHelper = new RayHelper(this._bottomRay)
    bottomRayHelper.show(this._scene, new Color3(0, 1, 0))
    this._mesh.checkCollisions = true
    this._mesh.rotate(Vector3.Up(), Math.PI)
    this._camera = new ArcRotateCamera(
      'playerCamera',
      Math.PI / 2,
      // 0,
      Math.PI / 2.5,
      5,
      this._mesh.position,
    )
    this._mesh.material = new StandardMaterial('playerMaterial', this._scene)
    this._mesh.material.diffuseColor = new Color3(1, 0, 0)
    var plane = MeshBuilder.CreatePlane("name_tag", { size: 2 });
    plane.parent = this._mesh;
    plane.position.y = 1;
    plane.billboardMode = Mesh.BILLBOARDMODE_ALL;
    this._labelTexture = AdvancedDynamicTexture.CreateForMesh(plane);
    this._labelText = new TextBlock("hero", "Hero");
    this._labelText.width = 1;
    this._labelText.height = 0.4;
    this._labelText.fontSize = 50;
    this._labelText.color = new Color3(0, 1, 1).toHexString();
    this._labelTexture.addControl(this._labelText);
    this._mesh.rotation.y = 0
    this._scene.activeCamera = this._camera
    this._camera.attachControl()

  }

  private _beforeRenderUpdate() {
    this._update()
  }
  private _update() {
    const deltaTime = this._scene.getEngine().getDeltaTime() / 100
    const turnAngle = this._turnSpeed * deltaTime
    //Manage the movements of the character (e.g. position, direction)
    if (this._input.inputMap['w']) {
      this._mesh.moveWithCollisions(this._mesh.forward.scale(this._forwardSpeed))
    }
    if (this._input.inputMap['s']) {
      this._mesh.moveWithCollisions(this._mesh.forward.scale(-this._backwardSpeed))
    }
    if (this._input.inputMap['a']) {
      this._mesh.rotate(Vector3.Up(), -turnAngle)
      this._camera.alpha += turnAngle;
    }
    if (this._input.inputMap['d']) {
      this._mesh.rotate(Vector3.Up(), turnAngle)

      this._camera.alpha -= turnAngle;
    }
    if (this._input.inputMap[' '] && this._grounded) {
      this._startPosition = this._mesh.position.clone()
      this._doJump(deltaTime)
    }
    this._frontRay.direction = this._mesh.forward
  }

  private _doJump(deltaTime: number) {
    this._grounded = false
    this._jumpTime = this._jumpTime + (deltaTime / 10);
    let jumpDist = this._calcJumpDist(this._forwardSpeed, deltaTime);
    this._mesh.moveWithCollisions(new Vector3(0, jumpDist, 0))
    setTimeout(() => { this._endJump() }, 550)
  }

  private _calcJumpDist(speed: number, dt: number): number {
    //up velocity at the begining of the last frame (v=u+at)
    let js: number = speed + this._gravity.y * this._jumpTime;
    //distance travelled up since last frame to this frame (s=ut+1/2*at^2)
    let jumpDist: number = js * (dt/10) -   this._gravity.y * (dt/10)^2;
    return jumpDist;
  }
  
  private _endJump() {
    const pick = this._scene.pickWithRay(this._bottomRay)
    if (pick?.hit) {
      this._grounded = true
    }
    this._jumpTime = 0;
  }
}

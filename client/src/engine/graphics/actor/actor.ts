import {
  AbstractMesh,
  AnimationGroup,
  ArcRotateCamera,
  Color3,
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

export class Actor extends TransformNode {
  private _mesh: AbstractMesh
  public _scene: Scene
  private _input: InputManager
  private _forwardSpeed: number = 0.08
  private _backwardSpeed: number = this._forwardSpeed * 0.5
  private _turnSpeed: number = Math.PI / 10
  private _height: number = 1.77
  private _grounded: boolean = true
  private _angle: number = 0
  private _camera: ArcRotateCamera
  private _frontRay: Ray
  private _bottomRay: Ray

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
    this._frontRay = new Ray(this._mesh.position, new Vector3(0, 0, -1), 1)
    const frontRayHelper = new RayHelper(this._frontRay)
    frontRayHelper.show(this._scene, new Color3(1, 0, 0))

    this._bottomRay = new Ray(this._mesh.position, new Vector3(0, -1, 0), 0.886)
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
    this._camera.checkCollisions = true
    this._mesh.rotation.y = 0
    this._scene.activeCamera = this._camera
    this._camera.attachControl()

  }
  // private _groundPlayer(vec: Vector3) {
  //   let y = 0
  //   console.log(this._scene.getMeshByName('Ground'))
  //   this._scene.getTransformNodeByName('ground')?.getChildMeshes().forEach((mesh) => {
  //     const ground = mesh as GroundMesh
  //     const height = ground.getHeightAtCoordinates(vec.x, vec.z)
  //     if (height > 0) {
  //       y = height + 0.885
  //     }
  //   })
  //   return y
  // }
  private _beforeRenderUpdate() {
    const pick = this._scene.pickWithRay(this._bottomRay)
    if (pick?.hit) {
      console.log('hit')
      this._grounded = true
    }
    this._update()
  }
  private _update() {
    const deltaTime = this._scene.getEngine().getDeltaTime() / 100
    const turnAngle = this._turnSpeed * deltaTime
    //Manage the movements of the character (e.g. position, direction)
    if (this._input.inputMap['w']) {
      const updatedMesh = this._mesh.moveWithCollisions(this._mesh.forward.scale(this._forwardSpeed))
      // updatedMesh.position.y = this._groundPlayer(updatedMesh.position);
    }
    if (this._input.inputMap['s']) {
      const updatedMesh = this._mesh.moveWithCollisions(this._mesh.forward.scale(-this._backwardSpeed))
      // updatedMesh.position.y = this._groundPlayer(updatedMesh.position);
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
      this._grounded = false
      this._mesh.moveWithCollisions(new Vector3(0, 0.8, 0))
    }
    this._frontRay.direction = this._mesh.forward
  }
}

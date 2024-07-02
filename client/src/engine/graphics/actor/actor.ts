import { ArcRotateCamera, Mesh, Scene, Skeleton, Vector3, Node, Nullable } from '@babylonjs/core'
import { DefaultActions } from './defaultActions'

export class Actor {
  private _avatar: Mesh
  private _camera: ArcRotateCamera
  private _scene: Scene
  private _skeleton: Skeleton

  private _hasCamera: boolean = true;

  private _gravity: number = 9.8;
  //slopeLimit in degrees
  private _minSlopeLimit: number = 30;
  private _maxSlopeLimit: number = 45;
  //slopeLimit in radians
  private _sl1: number = Math.PI * this._minSlopeLimit / 180;
  private _sl2: number = Math.PI * this._maxSlopeLimit / 180;

  //The av will step up a stair only if it is closer to the ground than the indicated value.
  private _stepOffset: number = 0.25;
  //toal amount by which the av has moved up
  private _vMoveTot: number = 0;
  //position of av when it started moving up
  private _vMovStartPos: Vector3 = Vector3.Zero();



  private _cameraElastic: boolean = true;
  private _cameraTarget: Vector3 = Vector3.Zero();

  private _actions = new DefaultActions();
  constructor(avatar: Mesh, camera: ArcRotateCamera, scene: Scene, actions: DefaultActions) {
    this._camera = camera;
    this._scene = scene;
    try {
      this.setAvatar(avatar)
    } catch (error) {
      console.error("Error: Could not set avatar")
    }
  } 
  public setSlopeLimit(minSlopeLimit: number, maxSlopeLimit: number) {
    this._minSlopeLimit = minSlopeLimit;
    this._maxSlopeLimit = maxSlopeLimit;

    this._sl1 = Math.PI * this._minSlopeLimit / 180;
    this._sl2 = Math.PI * this._maxSlopeLimit / 180;
  }

  private _root(tn: Node): Node {
    if (tn.parent == null) return tn;
    return this._root(tn.parent);
  }

  private _findSkel(n: Node): Nullable<Skeleton> {
    let root = this._root(n)

    if (root instanceof Mesh && root.skeleton) return root.skeleton

    //find all child meshes which have skeletons
    let ms = root.getChildMeshes(
      false,
      (cm) => {
      if (cm instanceof Mesh) {
        if (cm.skeleton) {
         return true
        }
      }
      return false
    })

    //return the skeleton of the first child mesh
    return ms[0].skeleton

  }

  public setAvatar(avatar: Mesh) {
    const root = this._root(avatar);
    if (root instanceof Mesh) {
      this._avatar = root;
    }
    const skeleton = this._findSkel(avatar);
    if (skeleton) {
      this._skeleton = skeleton;
    }
  }
  /**
   * The av will step up a stair only if it is closer to the ground than the indicated value.
   * Default value is 0.25 m
   */
  set stepOffset(stepOffset: number) {
    this._stepOffset = stepOffset;
  }

  set walkSpeed(walkSpeed: number) {
    this._actions.walk.speed = walkSpeed;
  }

  set runSpeed(runSpeed: number) {
    this._actions.run.speed = runSpeed;
  }

  set backSpeed(backwardSpeed: number) {
    this._actions.walkBack.speed = backwardSpeed;
  }

  set backFaseSpeed(backwardSpeed: number) {
    this._actions.walkBackFast.speed = backwardSpeed;
  }

  set jumpSpeed(jumpSpeed: number) {
    this._actions.idleJump.speed = jumpSpeed;
    this._actions.runJump.speed = jumpSpeed;
  }

  set leftSpeed(leftSpeed: number) {
    this._actions.strafeLeft.speed = leftSpeed;
  }
  
  set leftFastSpeed(leftSpeed: number) {
    this._actions.strafeLeftFast.speed = leftSpeed;
  }

  set rightSpeed(rightSpeed: number) {
    this._actions.strafeRight.speed = rightSpeed;
  }

  set rightFastSpeed(rightSpeed: number) {
    this._actions.strafeRightFast.speed = rightSpeed;
  }

  set turnSpeed(turnSpeed: number) {
    this._actions.turnLeft.speed = turnSpeed * Math.PI / 180;
    this._actions.turnRight.speed = turnSpeed * Math.PI / 180;
  }

  set turnFastSpeed(turnSpeed: number) {
    this._actions.turnLeftFast.speed = turnSpeed * Math.PI / 180;
    this._actions.turnRightFast.speed = turnSpeed * Math.PI / 180;
  }

  set gravity(gravity: number) {
    this._gravity = gravity;
  }

  set animationGroups(animationGroup: Actions) {
    this
  }

}
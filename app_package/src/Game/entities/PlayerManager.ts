import {
  AbstractMesh,
  Nullable,
  Scene,
  TransformNode,
  FollowCamera,
  Vector3,
} from "@babylonjs/core";
import { Assets } from "../Assets";
import { InputManager } from "../Inputs/InputManager";

export class PlayerManager {
  private scene: Scene;
  private camera: Nullable<FollowCamera>;
  private _camRoot: Nullable<TransformNode>;
  private player: Nullable<AbstractMesh>;
  private _yTilt: Nullable<TransformNode>;
  private static readonly ORIGINAL_TILT: Vector3 = new Vector3(
    0.5934119456780721,
    0,
    0
  );
  constructor(
    assets: Assets,
    camera: Nullable<FollowCamera>,
    inputManager: InputManager,
    scene: Scene
  ) {
    this.scene = scene;
    this.camera = null;
    this._camRoot = null;
    this._yTilt = null;
    this._setupPlayerCamera();
    this.player = assets.placeHolderChar;

    //Hero character variables
    var heroSpeed = 0.03;
    var heroSpeedBackwards = 0.01;
    var heroRotationSpeed = 0.1;

    var animating = true;

    const walkAnim = this.scene.getAnimationGroupByName("Walking_Forwards");
    const walkBackAnim =
      this.scene.getAnimationGroupByName("Walking_Backwards");
    const idleAnim = this.scene.getAnimationGroupByName("Idle");
    const jumpAnim = this.scene.getAnimationGroupByName("Jump");
    this.scene.onBeforeRenderObservable.add(() => {
      var keydown = false;
      //Manage the movements of the character (e.g. position, direction)
      if (inputManager.inputMap["w"]) {
        this.player?.moveWithCollisions(
          this.player?.forward.scaleInPlace(heroSpeed)
        );
        keydown = true;
      }
      if (inputManager.inputMap["s"]) {
        this.player?.moveWithCollisions(
          this.player?.forward.scaleInPlace(-heroSpeedBackwards)
        );

        keydown = true;
      }
      if (inputManager.inputMap["a"]) {
        this.player?.rotate(Vector3.Up(), -heroRotationSpeed);

        keydown = true;
      }
      if (inputManager.inputMap["d"]) {
        this.player?.rotate(Vector3.Up(), heroRotationSpeed);

        keydown = true;
      }
      // if (inputManager.inputMap[" "]) {
      //   this.player?.rotate(Vector3.Up(), heroRotationSpeed);
      //   keydown = true;
      // }

      //Manage animations to be played
      if (keydown) {
        if (!animating) {
          animating = true;
          if (inputManager.inputMap["s"]) {
            //Walk backwards
            walkBackAnim?.start(
              true,
              1.0,
              walkBackAnim?.from,
              walkBackAnim?.to,
              false
            );
          } else {
            //Walk
            walkAnim?.start(true, 1.0, walkAnim?.from, walkAnim?.to, false);
          }
        }
      } else {
        if (animating) {
          //Default animation is idle when no key is down
          idleAnim?.start(true, 1.0, idleAnim?.from, idleAnim?.to, false);

          //Stop all animations besides Idle Anim when no key is down
          walkAnim?.stop();
          walkBackAnim?.stop();

          //Ensure animation are played only once per rendering loop
          animating = false;
        }
      }
    });
  }

  private _setupPlayerCamera(): FollowCamera {
    //root camera parent that handles positioning of the camera to follow the this.player
    this._camRoot = new TransformNode("root");
    this._camRoot.position = new Vector3(0, 0, 0); //initialized at (0,0,0)
    //to face the this.player from behind (180 degrees)
    this._camRoot.rotation = new Vector3(0, Math.PI, 0);

    //rotations along the x-axis (up/down tilting)
    let yTilt = new TransformNode("ytilt");
    //adjustments to camera view to point down at our this.player
    yTilt.rotation = PlayerManager.ORIGINAL_TILT;
    this._yTilt = yTilt;
    yTilt.parent = this._camRoot;

    //our actual camera that's pointing at our root's position
    this.camera = new FollowCamera("cam", new Vector3(0, 0, -10), this.scene);
    this.camera.lockedTarget = this.player;
    this.camera.fov = 0.47350045992678597;
    // this.camera.parent = yTilt;

    this.scene.activeCamera = this.camera;
    return this.camera;
  }
}

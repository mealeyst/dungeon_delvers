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
  private player: Nullable<AbstractMesh>;
  constructor(
    assets: Assets,
    inputManager: InputManager,
    scene: Scene
  ) {
    this.scene = scene;
    this.camera = null;
    this.player = assets.placeHolderChar!;
    this.player.checkCollisions = true;
    this._setupPlayerCamera();

    //Hero character variables
    var heroSpeed = 0.03;
    var heroSpeedBackwards = 0.01;
    var heroRotationSpeed = 0.1;

    var animating = true;

    const walkAnim = this.scene.getAnimationGroupByName("Walking_Forwards");
    const walkBackAnim =
      this.scene.getAnimationGroupByName("Walking_Backwards");
    const turnLeft =
      this.scene.getAnimationGroupByName("Stand_Turn_Left");
    const turnRight =
      this.scene.getAnimationGroupByName("Stand_Turn_Right");
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
      // this.player?.moveWithCollisions(this.scene.gravity)
    });
  }

  private _setupPlayerCamera(): FollowCamera {
    //our actual camera that's pointing at our root's position
    this.camera = new FollowCamera("cam", new Vector3(0, 2, -5), this.scene);
    this.camera.lowerRadiusLimit = -6;
    this.camera.upperRadiusLimit = -2;
    this.camera.lowerHeightOffsetLimit = 0.5;
    this.camera.upperHeightOffsetLimit = 0.5;
    this.camera.inertia = 0.01;

    // //The goal distance of camera from target
    this.camera.radius = -5;
    
    // // The goal height of camera above local oriin (centre) of target
    this.camera.heightOffset = 0;
    
    // // The goal rotation of camera around local origin (centre) of target in x y plane
    // this.camera.rotationOffset = 1;
    
    // //Acceleration of camera in moving from current to goal position
    this.camera.cameraAcceleration = 0.5
    
    // //The speed at which acceleration is halted 
    this.camera.maxCameraSpeed = 10
    
    //this.camera.target is set after the target's creation
      
    // This attaches the camera to the canvas
    this.camera.attachControl(true);

    this.scene.addCamera(this.camera);

    this.scene.activeCamera = this.camera;
    
    this.camera.lockedTarget = this.player

    return this.camera;
  }
}

import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";
import { Assets } from "../Assets";
import { InputManager } from "../Inputs/InputManager";

export class PlayerManager {
  constructor(
    assets: Assets,
    camera: ArcRotateCamera,
    inputManager: InputManager,
    scene: Scene
  ) {
    const player = assets.placeHolderChar;

    //Lock camera on the character
    camera.lockedTarget = player?.position as Vector3;

    //Hero character variables
    var heroSpeed = 0.03;
    var heroSpeedBackwards = 0.01;
    var heroRotationSpeed = 0.1;

    var animating = true;

    const walkAnim = scene.getAnimationGroupByName("Walking_Forwards");
    const walkBackAnim = scene.getAnimationGroupByName("Walking_Backwards");
    const idleAnim = scene.getAnimationGroupByName("Idle");
    scene.onBeforeRenderObservable.add(() => {
      var keydown = false;
      //Manage the movements of the character (e.g. position, direction)
      if (inputManager.inputMap["w"]) {
        player?.moveWithCollisions(player?.forward.scaleInPlace(heroSpeed));
        keydown = true;
      }
      if (inputManager.inputMap["s"]) {
        player?.moveWithCollisions(
          player?.forward.scaleInPlace(-heroSpeedBackwards)
        );
        keydown = true;
      }
      if (inputManager.inputMap["a"]) {
        player?.rotate(Vector3.Up(), -heroRotationSpeed);
        keydown = true;
      }
      if (inputManager.inputMap["d"]) {
        player?.rotate(Vector3.Up(), heroRotationSpeed);
        keydown = true;
      }
      if (inputManager.inputMap["b"]) {
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
    });
  }
}

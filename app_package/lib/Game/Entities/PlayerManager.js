"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerManager = void 0;
const core_1 = require("@babylonjs/core");
class PlayerManager {
    constructor(assets, camera, inputManager, scene) {
        const player = assets.placeHolderChar;
        //Lock camera on the character
        camera.lockedTarget = player === null || player === void 0 ? void 0 : player.position;
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
                player === null || player === void 0 ? void 0 : player.moveWithCollisions(player === null || player === void 0 ? void 0 : player.forward.scaleInPlace(heroSpeed));
                keydown = true;
            }
            if (inputManager.inputMap["s"]) {
                player === null || player === void 0 ? void 0 : player.moveWithCollisions(player === null || player === void 0 ? void 0 : player.forward.scaleInPlace(-heroSpeedBackwards));
                keydown = true;
            }
            if (inputManager.inputMap["a"]) {
                player === null || player === void 0 ? void 0 : player.rotate(core_1.Vector3.Up(), -heroRotationSpeed);
                keydown = true;
            }
            if (inputManager.inputMap["d"]) {
                player === null || player === void 0 ? void 0 : player.rotate(core_1.Vector3.Up(), heroRotationSpeed);
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
                        walkBackAnim === null || walkBackAnim === void 0 ? void 0 : walkBackAnim.start(true, 1.0, walkBackAnim === null || walkBackAnim === void 0 ? void 0 : walkBackAnim.from, walkBackAnim === null || walkBackAnim === void 0 ? void 0 : walkBackAnim.to, false);
                    }
                    else {
                        //Walk
                        walkAnim === null || walkAnim === void 0 ? void 0 : walkAnim.start(true, 1.0, walkAnim === null || walkAnim === void 0 ? void 0 : walkAnim.from, walkAnim === null || walkAnim === void 0 ? void 0 : walkAnim.to, false);
                    }
                }
            }
            else {
                if (animating) {
                    //Default animation is idle when no key is down
                    idleAnim === null || idleAnim === void 0 ? void 0 : idleAnim.start(true, 1.0, idleAnim === null || idleAnim === void 0 ? void 0 : idleAnim.from, idleAnim === null || idleAnim === void 0 ? void 0 : idleAnim.to, false);
                    //Stop all animations besides Idle Anim when no key is down
                    walkAnim === null || walkAnim === void 0 ? void 0 : walkAnim.stop();
                    walkBackAnim === null || walkBackAnim === void 0 ? void 0 : walkBackAnim.stop();
                    //Ensure animation are played only once per rendering loop
                    animating = false;
                }
            }
        });
    }
}
exports.PlayerManager = PlayerManager;
//# sourceMappingURL=PlayerManager.js.map
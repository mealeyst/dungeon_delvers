"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerManager = void 0;
const core_1 = require("@babylonjs/core");
class PlayerManager {
    constructor(assets, camera, inputManager, scene) {
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
        const walkBackAnim = this.scene.getAnimationGroupByName("Walking_Backwards");
        const idleAnim = this.scene.getAnimationGroupByName("Idle");
        const jumpAnim = this.scene.getAnimationGroupByName("Jump");
        this.scene.onBeforeRenderObservable.add(() => {
            var _a, _b, _c, _d, _e, _f;
            var keydown = false;
            //Manage the movements of the character (e.g. position, direction)
            if (inputManager.inputMap["w"]) {
                (_a = this.player) === null || _a === void 0 ? void 0 : _a.moveWithCollisions((_b = this.player) === null || _b === void 0 ? void 0 : _b.forward.scaleInPlace(heroSpeed));
                keydown = true;
            }
            if (inputManager.inputMap["s"]) {
                (_c = this.player) === null || _c === void 0 ? void 0 : _c.moveWithCollisions((_d = this.player) === null || _d === void 0 ? void 0 : _d.forward.scaleInPlace(-heroSpeedBackwards));
                keydown = true;
            }
            if (inputManager.inputMap["a"]) {
                (_e = this.player) === null || _e === void 0 ? void 0 : _e.rotate(core_1.Vector3.Up(), -heroRotationSpeed);
                keydown = true;
            }
            if (inputManager.inputMap["d"]) {
                (_f = this.player) === null || _f === void 0 ? void 0 : _f.rotate(core_1.Vector3.Up(), heroRotationSpeed);
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
    _setupPlayerCamera() {
        //root camera parent that handles positioning of the camera to follow the this.player
        this._camRoot = new core_1.TransformNode("root");
        this._camRoot.position = new core_1.Vector3(0, 0, 0); //initialized at (0,0,0)
        //to face the this.player from behind (180 degrees)
        this._camRoot.rotation = new core_1.Vector3(0, Math.PI, 0);
        //rotations along the x-axis (up/down tilting)
        let yTilt = new core_1.TransformNode("ytilt");
        //adjustments to camera view to point down at our this.player
        yTilt.rotation = PlayerManager.ORIGINAL_TILT;
        this._yTilt = yTilt;
        yTilt.parent = this._camRoot;
        //our actual camera that's pointing at our root's position
        this.camera = new core_1.FollowCamera("cam", new core_1.Vector3(0, 0, -10), this.scene);
        this.camera.lockedTarget = this.player;
        this.camera.fov = 0.47350045992678597;
        // this.camera.parent = yTilt;
        this.scene.activeCamera = this.camera;
        return this.camera;
    }
}
exports.PlayerManager = PlayerManager;
PlayerManager.ORIGINAL_TILT = new core_1.Vector3(0.5934119456780721, 0, 0);
//# sourceMappingURL=PlayerManager.js.map
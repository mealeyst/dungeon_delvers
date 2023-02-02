"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerManager = void 0;
const core_1 = require("@babylonjs/core");
class PlayerManager {
    constructor(assets, inputManager, scene) {
        this.scene = scene;
        this.camera = null;
        this.player = assets.placeHolderChar;
        console.log("We hitting constructor?", this.player);
        this._setupPlayerCamera();
        //Hero character variables
        var heroSpeed = 0.03;
        var heroSpeedBackwards = 0.01;
        var heroRotationSpeed = 0.1;
        var animating = true;
        const walkAnim = this.scene.getAnimationGroupByName("Walking_Forwards");
        const walkBackAnim = this.scene.getAnimationGroupByName("Walking_Backwards");
        const turnLeft = this.scene.getAnimationGroupByName("Stand_Turn_Left");
        const turnRight = this.scene.getAnimationGroupByName("Stand_Turn_Right");
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
        //our actual camera that's pointing at our root's position
        this.camera = new core_1.FollowCamera("cam", new core_1.Vector3(0, 2, -5), this.scene);
        this.camera.lowerRadiusLimit = -6;
        this.camera.upperRadiusLimit = -2;
        this.camera.lowerHeightOffsetLimit = 0.5;
        this.camera.upperHeightOffsetLimit = 0.5;
        this.camera.inertia = 0.01;
        // this.camera.
        // //The goal distance of camera from target
        this.camera.radius = -5;
        // // The goal height of camera above local oriin (centre) of target
        this.camera.heightOffset = 0;
        // // The goal rotation of camera around local origin (centre) of target in x y plane
        // this.camera.rotationOffset = 1;
        // //Acceleration of camera in moving from current to goal position
        this.camera.cameraAcceleration = 0.5;
        // //The speed at which acceleration is halted 
        this.camera.maxCameraSpeed = 10;
        //this.camera.target is set after the target's creation
        // This attaches the camera to the canvas
        this.camera.attachControl(true);
        this.scene.addCamera(this.camera);
        this.scene.activeCamera = this.camera;
        this.camera.lockedTarget = this.player;
        console.log('We are hitting');
        return this.camera;
    }
}
exports.PlayerManager = PlayerManager;
//# sourceMappingURL=PlayerManager.js.map
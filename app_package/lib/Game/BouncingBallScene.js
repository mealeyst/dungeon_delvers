"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BouncingBallScene = void 0;
const core_1 = require("@babylonjs/core");
const BouncingBall_1 = require("./BouncingBall");
class BouncingBallScene extends core_1.Scene {
    constructor(engine) {
        super(engine);
        new BouncingBall_1.BouncingBall(this);
        core_1.Mesh.CreateGround("ground1", 6, 6, 2, this);
        this.createDefaultCameraOrLight();
    }
}
exports.BouncingBallScene = BouncingBallScene;
//# sourceMappingURL=BouncingBallScene.js.map
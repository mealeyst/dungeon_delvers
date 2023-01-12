"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BouncingBall = void 0;
const core_1 = require("@babylonjs/core");
class BouncingBall extends core_1.TransformNode {
    constructor(scene) {
        super("bouncingBall", scene);
        this._sphere = core_1.Mesh.CreateSphere("sphere", 16, 2, scene);
        this._sphere.setParent(this);
        this.position.y = 1;
        scene.onBeforeRenderObservable.runCoroutineAsync(this._bounceCoroutine());
    }
    *_bounceCoroutine() {
        for (let frameCount = 0; true; ++frameCount) {
            this._sphere.position.y = 1 + 2 * Math.abs(Math.sin(frameCount / 16));
            yield;
        }
    }
}
exports.BouncingBall = BouncingBall;
//# sourceMappingURL=BouncingBall.js.map
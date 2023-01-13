"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const core_1 = require("@babylonjs/core");
const Input_1 = require("./Inputs/Input");
class Agent {
    constructor() {
        this.forward = new core_1.Vector3();
        this.right = new core_1.Vector3();
        this.quat = new core_1.Quaternion();
        this.position = new core_1.Vector3();
        this.input = new Input_1.Input();
        this.transformNode = null;
    }
    // modify input to go toward a direction and return dot product
    goToward(aimPos, aimAt, turnRatio) {
        const dif = aimPos.subtract(aimAt);
        dif.normalize();
        const dotTgt = core_1.Vector3.Dot(dif, this.forward);
        this.input.dx = core_1.Vector3.Dot(dif, this.right) * turnRatio; //0.02;
        return dotTgt;
    }
}
exports.Agent = Agent;
//# sourceMappingURL=Agent.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputManager = void 0;
const core_1 = require("@babylonjs/core");
class InputManager {
    constructor(scene, assets) {
        this.inputMap = {};
        scene.actionManager = new core_1.ActionManager(scene);
        scene.actionManager.registerAction(new core_1.ExecuteCodeAction(core_1.ActionManager.OnKeyDownTrigger, (event) => {
            this.inputMap[event.sourceEvent.key] =
                event.sourceEvent.type == "keydown";
        }));
        scene.actionManager.registerAction(new core_1.ExecuteCodeAction(core_1.ActionManager.OnKeyUpTrigger, (event) => {
            this.inputMap[event.sourceEvent.key] =
                event.sourceEvent.type == "keydown";
        }));
    }
}
exports.InputManager = InputManager;
//# sourceMappingURL=InputManager.js.map
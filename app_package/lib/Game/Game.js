"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGameScene = void 0;
const BouncingBallScene_1 = require("./BouncingBallScene");
class Game {
    static CreateScene(engine, assetsHostUrl, canvas) {
        let scene = new BouncingBallScene_1.BouncingBallScene(engine);
        return scene;
    }
}
function CreateGameScene(engine, assetsHostUrl, canvas) {
    return Game.CreateScene(engine, assetsHostUrl, canvas);
}
exports.CreateGameScene = CreateGameScene;
//# sourceMappingURL=Game.js.map
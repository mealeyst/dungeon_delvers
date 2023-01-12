"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGameScene = void 0;
const core_1 = require("@babylonjs/core");
require("@babylonjs/inspector");
const dat_gui_1 = require("dat.gui");
const Assets_1 = require("./Assets");
const Sky_1 = __importDefault(require("./Sky"));
class Game {
    constructor(engine, assetsHostUrl, canvas) {
        this.initializeGui = () => {
            const gui = new dat_gui_1.GUI();
            return gui;
        };
        this.scene = new core_1.Scene(engine);
        this.scene.debugLayer.show();
        // scene.clearColor = new Color4(0, 0, 0, 1);
        // scene.autoClearDepthAndStencil = false;
        // scene.skipPointerMovePicking = true;
        // scene.pointerUpPredicate = () => false;
        // scene.pointerDownPredicate = () => false;
        // scene.pointerMovePredicate = () => false;
        // lighting
        const dirLight = new core_1.DirectionalLight("dirLight", new core_1.Vector3(0.47, -0.19, -0.86), this.scene);
        dirLight.diffuse = core_1.Color3.FromInts(255, 251, 199);
        dirLight.intensity = 1.5;
        // This creates and positions a free camera (non-mesh)
        var camera = new core_1.UniversalCamera("camera1", new core_1.Vector3(0, 2, -5), this.scene);
        this.gui = this.initializeGui();
        new Assets_1.Assets(this.scene, assetsHostUrl, (assets) => {
            new Sky_1.default(this.gui, this.scene);
            console.log("onReady", assets);
        }, (assets) => {
            console.log("onReady", assets);
        });
    }
    getScene() {
        return this.scene;
    }
}
function CreateGameScene(engine, assetsHostUrl, canvas) {
    const game = new Game(engine, assetsHostUrl, canvas);
    return game.getScene();
}
exports.CreateGameScene = CreateGameScene;
//# sourceMappingURL=Game.js.map
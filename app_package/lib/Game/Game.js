"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGameScene = void 0;
const core_1 = require("@babylonjs/core");
require("@babylonjs/inspector");
const Assets_1 = require("./Assets");
const DungeonGenerator_1 = require("./entities/ground/DungeonGenerator");
class Game {
    constructor(engine, assetsHostUrl, canvas) {
        this._inputManager = null;
        this.scene = new core_1.Scene(engine);
        this.scene.debugLayer.show();
        // scene.clearColor = new Color4(0, 0, 0, 1);
        // scene.autoClearDepthAndStencil = false;
        // scene.skipPointerMovePicking = true;
        // scene.pointerUpPredicate = () => false;
        // scene.pointerDownPredicate = () => false;
        // scene.pointerMovePredicate = () => false;
        // lighting
        // const dirLight = new DirectionalLight(
        //   "dirLight",
        //   new Vector3(10, 10, -0.86),
        //   this.scene
        // );
        // dirLight.diffuse = Color3.FromInts(255, 251, 199);
        // dirLight.intensity = 1.5;
        const sunPosition = new core_1.Vector3(0, 100, 0);
        const light = new core_1.HemisphericLight("light", sunPosition, this.scene);
        // This creates and positions a free camera (non-mesh)
        var camera = new core_1.ArcRotateCamera("playerCamera", Math.PI / 2, Math.PI / 2, 5, new core_1.Vector3(0, 2, -5), this.scene);
        this.scene.addCamera(camera);
        this.scene.activeCamera = camera;
        this.scene.activeCamera.attachControl(canvas, true);
        // camera.lowerRadiusLimit = 2;
        // camera.upperRadiusLimit = 10;
        // camera.wheelDeltaPercentage = 0.01;
        const gravityVector = new core_1.Vector3(0, -9.81, 0);
        this.scene.collisionsEnabled = true;
        const physicsPlugin = new core_1.CannonJSPlugin();
        this.scene.enablePhysics(gravityVector, physicsPlugin);
        new Assets_1.Assets(this.scene, assetsHostUrl, (assets) => {
            // new Sky("sky", this.scene, assets);
            // new TerrainChunkManager(this.gui, this.scene, assets);
            // this._inputManager = new InputManager(this.scene, assets);
            // new PlayerManager(assets, this._inputManager, this.scene);
            new DungeonGenerator_1.DungeonGenerator("dungeon", this.scene);
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
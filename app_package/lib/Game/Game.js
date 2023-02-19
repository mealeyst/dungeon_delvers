"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGameScene = void 0;
const core_1 = require("@babylonjs/core");
require("@babylonjs/inspector");
const Assets_1 = require("./Assets");
const Dungeon_1 = require("./entities/generators/Dungeon");
class Game {
    constructor(engine, assetsHostUrl, canvas) {
        this._inputManager = null;
        this.scene = new core_1.Scene(engine);
        this.scene.debugLayer.show();
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
            new Dungeon_1.Dungeon("dungeon", this.scene);
            // new Sky("sky", this.scene, assets);
            // new TerrainChunkManager(this.gui, this.scene, assets);
            // this._inputManager = new InputManager(this.scene, assets);
            // new PlayerManager(assets, this._inputManager, this.scene);
            // const floor = MeshBuilder.CreateGround("floor", {
            //   height: Math.floor(Math.random() * 30) + 20,
            //   width: Math.floor(Math.random() * 30) + 20,
            //   subdivisions: 4,
            // });
            // floor.setPivotPoint(new Vector3(floor._width / 2, 0, floor._height / 2));
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
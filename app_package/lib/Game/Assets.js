"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assets = void 0;
const core_1 = require("@babylonjs/core");
class Assets {
    constructor(scene, assetsHostUrl, onReady, onLoadComplete) {
        this.assetsHostUrl = assetsHostUrl;
        this.placeHolderChar = null;
        this.groundTexture = null;
        //Minimal loading
        const assetsManagerMinimal = new core_1.AssetsManager(scene);
        const placeHolderCharTask = assetsManagerMinimal.addMeshTask("PlaceHolderChar", "", `${assetsHostUrl}assets/gltf/`, "YBot_With_Locomotion.glb");
        placeHolderCharTask.onSuccess = (task) => {
            this.placeHolderChar = task.loadedMeshes[0];
            this.placeHolderChar;
        };
        const groundTextureTask = assetsManagerMinimal.addTextureTask("GroundTexture", `${assetsHostUrl}assets/textures/ground.jpg`);
        groundTextureTask.onSuccess = (task) => {
            this.groundTexture = task.texture;
        };
        assetsManagerMinimal.load();
        onReady(this);
    }
}
exports.Assets = Assets;
//# sourceMappingURL=Assets.js.map
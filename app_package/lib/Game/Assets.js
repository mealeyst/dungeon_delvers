"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assets = void 0;
const core_1 = require("@babylonjs/core");
class Assets {
    constructor(scene, assetsHostUrl, onReady) {
        const _this = this;
        this.assetsHostUrl = assetsHostUrl;
        this.placeHolderChar = null;
        this.groundTexture = null;
        this.starboxTexture = null;
        //Minimal loading
        const assetsManagerMinimal = new core_1.AssetsManager(scene);
        const placeHolderCharTask = assetsManagerMinimal.addMeshTask("PlaceHolderChar", "", `${assetsHostUrl}assets/gltf/`, "YBot_With_Locomotion.glb");
        placeHolderCharTask.onSuccess = (task) => {
            _this.placeHolderChar = task.loadedMeshes[0];
            _this.placeHolderChar;
        };
        const groundTextureTask = assetsManagerMinimal.addTextureTask("GroundTexture", `${assetsHostUrl}assets/textures/ground.jpg`);
        groundTextureTask.onSuccess = (task) => {
            _this.groundTexture = task.texture;
        };
        const starboxTask = assetsManagerMinimal.addCubeTextureTask("StarboxTextureTask", `${assetsHostUrl}assets/textures/`, [
            "Starbox_right1.jpg",
            "Starbox_top3.jpg",
            "Starbox_front5.jpg",
            "Starbox_left2.jpg",
            "Starbox_bottom4.jpg",
            "Starbox_back6.jpg",
        ]);
        starboxTask.onSuccess = (task) => {
            _this.starboxTexture = task.texture;
        };
        assetsManagerMinimal.load();
        assetsManagerMinimal.onFinish = () => {
            onReady(_this);
        };
    }
}
exports.Assets = Assets;
//# sourceMappingURL=Assets.js.map
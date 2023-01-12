"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assets = void 0;
const core_1 = require("@babylonjs/core");
class Assets {
    constructor(scene, assetsHostUrl, onReady, onLoadComplete) {
        this.assetsHostUrl = assetsHostUrl;
        this.PlaceHolderChar = null;
        console.log("Hitting Constructor");
        // add in IBL with linked environment
        this.envCube = core_1.CubeTexture.CreateFromPrefilteredData(`${assetsHostUrl}/assets/env/environment.env`, scene);
        this.envCube.name = "environment";
        this.envCube.gammaSpace = false;
        this.envCube.rotationY = 1.977;
        scene.environmentTexture = this.envCube;
        scene.environmentIntensity = 1.25;
        //Minimal loading
        const assetsManagerMinimal = new core_1.AssetsManager(scene);
        const placeHolderCharTask = assetsManagerMinimal.addMeshTask("PlaceHolderChar", "", `${assetsHostUrl}assets/gltf/`, "YBot_With_Locomotion.glb");
        placeHolderCharTask.onSuccess = (task) => {
            this.PlaceHolderChar = task.loadedMeshes[0];
            this.PlaceHolderChar;
        };
        assetsManagerMinimal.load();
        onReady(this);
    }
}
exports.Assets = Assets;
//# sourceMappingURL=Assets.js.map
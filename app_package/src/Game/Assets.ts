import {
  AbstractMesh,
  AssetsManager,
  CubeTexture,
  MeshAssetTask,
  Nullable,
  Scene,
} from "@babylonjs/core";

export class Assets {
  public assetsHostUrl: string;
  public PlaceHolderChar: Nullable<AbstractMesh>;
  public envCube: CubeTexture;
  constructor(
    scene: Scene,
    assetsHostUrl: string,
    onReady: (assets: Assets) => void,
    onLoadComplete: (assets: Assets) => void
  ) {
    this.assetsHostUrl = assetsHostUrl;
    this.PlaceHolderChar = null;
    console.log("Hitting Constructor");

    // add in IBL with linked environment
    this.envCube = CubeTexture.CreateFromPrefilteredData(
      `${assetsHostUrl}/assets/env/environment.env`,
      scene
    );
    this.envCube.name = "environment";
    this.envCube.gammaSpace = false;
    this.envCube.rotationY = 1.977;

    scene.environmentTexture = this.envCube;
    scene.environmentIntensity = 1.25;

    //Minimal loading
    const assetsManagerMinimal = new AssetsManager(scene);
    const placeHolderCharTask = assetsManagerMinimal.addMeshTask(
      "PlaceHolderChar",
      "",
      `${assetsHostUrl}assets/gltf/`,
      "YBot_With_Locomotion.glb"
    );
    placeHolderCharTask.onSuccess = (task: MeshAssetTask) => {
      this.PlaceHolderChar = task.loadedMeshes[0];
      this.PlaceHolderChar;
    };
    assetsManagerMinimal.load();
    onReady(this);
  }
}

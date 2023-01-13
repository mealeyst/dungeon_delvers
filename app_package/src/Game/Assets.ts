import {
  AbstractMesh,
  AssetsManager,
  MeshAssetTask,
  Nullable,
  Scene,
  Texture,
  TextureAssetTask,
} from "@babylonjs/core";

export class Assets {
  public assetsHostUrl: string;
  public placeHolderChar: Nullable<AbstractMesh>;
  public groundTexture: Nullable<Texture>;
  constructor(
    scene: Scene,
    assetsHostUrl: string,
    onReady: (assets: Assets) => void
  ) {
    const _this = this;
    this.assetsHostUrl = assetsHostUrl;
    this.placeHolderChar = null;
    this.groundTexture = null;
    //Minimal loading
    const assetsManagerMinimal = new AssetsManager(scene);
    const placeHolderCharTask = assetsManagerMinimal.addMeshTask(
      "PlaceHolderChar",
      "",
      `${assetsHostUrl}assets/gltf/`,
      "YBot_With_Locomotion.glb"
    );
    placeHolderCharTask.onSuccess = (task: MeshAssetTask) => {
      _this.placeHolderChar = task.loadedMeshes[0];
      _this.placeHolderChar;
    };
    const groundTextureTask = assetsManagerMinimal.addTextureTask(
      "GroundTexture",
      `${assetsHostUrl}assets/textures/ground.jpg`
    );
    groundTextureTask.onSuccess = (task: TextureAssetTask) => {
      _this.groundTexture = task.texture;
    };
    assetsManagerMinimal.load();
    assetsManagerMinimal.onFinish = () => {
      onReady(_this);
    };
  }
}

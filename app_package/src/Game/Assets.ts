import {
  AbstractMesh,
  AssetsManager,
  CubeTexture,
  CubeTextureAssetTask,
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
  public starboxTexture: Nullable<CubeTexture>;
  constructor(
    scene: Scene,
    assetsHostUrl: string,
    onReady: (assets: Assets) => void
  ) {
    const _this = this;
    this.assetsHostUrl = assetsHostUrl;
    this.placeHolderChar = null;
    this.groundTexture = null;
    this.starboxTexture = null;
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
    const starboxTask = assetsManagerMinimal.addCubeTextureTask(
      "StarboxTextureTask",
      `${assetsHostUrl}assets/textures/`,
      [
        "Starbox_right1.jpg",
        "Starbox_top3.jpg",
        "Starbox_front5.jpg",
        "Starbox_left2.jpg",
        "Starbox_bottom4.jpg",
        "Starbox_back6.jpg",
      ]
    );
    starboxTask.onSuccess = (task: CubeTextureAssetTask) => {
      _this.starboxTexture = task.texture;
    };
    assetsManagerMinimal.load();
    assetsManagerMinimal.onFinish = () => {
      onReady(_this);
    };
  }
}

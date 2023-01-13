import {
  AbstractMesh,
  AssetsManager,
  CubeTexture,
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
    onReady: (assets: Assets) => void,
    onLoadComplete: (assets: Assets) => void
  ) {
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
      this.placeHolderChar = task.loadedMeshes[0];
      this.placeHolderChar;
    };
    const groundTextureTask = assetsManagerMinimal.addTextureTask(
      "GroundTexture",
      `${assetsHostUrl}assets/textures/ground.jpg`
    );
    groundTextureTask.onSuccess = (task: TextureAssetTask) => {
      this.groundTexture = task.texture;
    };
    assetsManagerMinimal.load();
    onReady(this);
  }
}

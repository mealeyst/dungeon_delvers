import {
  AbstractMesh,
  Color3,
  MeshBuilder,
  Scene,
  SceneLoader,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core'
import dungeonAssets from '../../../public/assets/models/dungeon_assets.glb'
import { BinarySpacePartition } from './binarySpacePartition'
import { DungeonGenerator } from './dungeon_generator'

type StageAssets = {
  _dungeon: AbstractMesh
  balcony: AbstractMesh
  ceiling: AbstractMesh
  door: AbstractMesh
  doorFrame: AbstractMesh
  floor: AbstractMesh
  spiral_stair: AbstractMesh
  stair_landing: AbstractMesh
  stair_wall: AbstractMesh
  stair: AbstractMesh
  wall: AbstractMesh
  wall_corner: AbstractMesh
}

export class Stage {
  private _scene: Scene
  private _assets: StageAssets
  constructor(scene: Scene) {
    this._scene = scene
    this.load()
  }

  public async load() {
    const dungeonAssetsResult = await SceneLoader.ImportMeshAsync(
      null,
      '',
      dungeonAssets,
      this._scene,
    )
    this._assets = dungeonAssetsResult.meshes.reduce(
      (accumulator: StageAssets, asset: AbstractMesh) => {
        asset.isVisible = false
        switch (asset.name) {
          case 'Balcony':
            accumulator.balcony = asset
            break
          case 'Ceiling':
            accumulator.ceiling = asset
            break
          case 'Door':
            accumulator.door = asset
            break
          case 'Floor':
            accumulator.floor = asset
            break
          case 'Spiral_Stairs':
            accumulator.spiral_stair = asset
            break
          case 'Stair_Landing':
            accumulator.stair_landing = asset
            break
          case 'Stair_Wall':
            accumulator.stair_wall = asset
            break
          case 'Stairs':
            accumulator.stair = asset
            break
          case 'Wall_001':
            accumulator.wall = asset
            break
          case 'Wall_Corner':
            accumulator.wall_corner = asset
            break
          case 'Wall_Door_Frame':
            accumulator.doorFrame = asset
            break
          default:
            break
        }
        return accumulator
      },
      {} as StageAssets,
    )
    const floor_1 = this._assets.floor.clone('floor_1', null) as AbstractMesh
    floor_1.isVisible = true
    console.log(floor_1.getBoundingInfo().boundingBox)
    // const floor_2 = this._assets.floor.clone('floor_2', null) as AbstractMesh
    // floor_2.isVisible = true
    // floor_2.position.z = 2
    // const floor_3 = this._assets.floor.clone('floor_3', null) as AbstractMesh
    // floor_3.isVisible = true
    // floor_3.position.x = 2
    // const wall_1 = this._assets.wall_corner.clone(
    //   'wall_1',
    //   null,
    // ) as AbstractMesh
    // wall_1.isVisible = true
    // wall_1.position.x = 0
    // wall_1.rotation = new Vector3(Math.PI / 2, 0, 0)
    new DungeonGenerator('dungeon', this._scene)
  }
}

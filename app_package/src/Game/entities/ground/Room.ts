import { GroundMesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { DungeonGenerator } from "./DungeonGenerator";

export class Room {
  _floor: GroundMesh;
  public radius: number;
  public position: Vector3;
  constructor(
    name: string,
    scene: Scene,
    parent: DungeonGenerator,
    meshes: Room[]
  ) {
    const height = Math.floor(Math.random() * 9) + 1 * 4;
    const width = Math.floor(Math.random() * 9) + 1 * 4;
    this._floor = MeshBuilder.CreateGround(name, {
      height,
      width,
    });
    this.radius = Math.sqrt(height ** 2 + width ** 2);
    this._floor.parent = parent;
    this.position = this.getRandomPointInCircle(20);
    this._floor.position = this.position;
  }
}

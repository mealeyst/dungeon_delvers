import { GroundMesh, MeshBuilder, Scene, Vector2, Vector3 } from "@babylonjs/core";
import { DungeonGenerator } from "./DungeonGenerator";

export class Room {
  _floor: GroundMesh;
  public radius: number
  public position: Vector3
  constructor(name: string, scene: Scene, parent: DungeonGenerator) {
    const height = Math.floor(Math.random() * 9) + 1 * 4;
    const width = Math.floor(Math.random() * 9) + 1 * 4;
    this._floor = MeshBuilder.CreateGround(name, {
      height,
      width
    });
    this.radius = Math.sqrt(height**2 + width**2);
    this._floor.parent = parent;
    this.position = this.getRandomPointInCircle(20);
    this._floor.position = this.position
  }

  private getRandomPointInCircle(radius: number) {
    const t = 2 * Math.PI * Math.random();
    const u = Math.random() + Math.random();
    let r = null;
    if (u > 1) {
      r = 2 - u;
    } else {
      r = u;
    }
    return new Vector3(radius * r * Math.cos(t), 0, radius * r * Math.sin(t));
  }

  private seperate(meshes: Room[]) {
    const sum = new Vector3();
    let count = 0;
    for (let meshID = 0; meshID < meshes.length; meshID++) {
      const desiredSeparation = this.radius + meshes[meshID].radius + ( 25 ) + ( 50 );
      var sep = Vector3.Distance(this.position, meshes[meshID].position);
      if ( (sep > 0) && (sep < desiredSeparation) ) {
        var thisposition = this.position.clone();
        var diff = thisposition.subtract(meshes[meshID].position);
        diff.normalize();
        diff.divide(new Vector3(sep, 0, sep));
        sum.add(diff);
        count++;
      }
    }
    if (count > 0) {
      sum.divide(new Vector3(count, 0, count));
      sum.normalize();
      sum.multiply(new Vector3(5, 0, 5));
    }
    return sum;
  }
}
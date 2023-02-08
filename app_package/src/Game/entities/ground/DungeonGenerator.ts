import { GroundMesh, MeshBuilder, VertexBuffer } from "@babylonjs/core";
import { Vector2, Vector3 } from "@babylonjs/core/Maths/math";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";
import { Room } from "./Room";

export class DungeonGenerator extends TransformNode {
  _meshes: Room[];
  constructor(name: string, scene: Scene) {
    super(name, scene);
    this._meshes = [];
    for (let i = 0; i < Math.floor(Math.random() * 20 + 10); i++) {
      
      this._meshes.push(new Room(`room_${i}_floor`, scene, this));
    }
  }
}

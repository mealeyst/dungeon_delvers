import { GroundMesh, MeshBuilder, VertexBuffer } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";

export class DungeonGenerator extends TransformNode {
  _meshes: GroundMesh[];
  constructor(name: string, scene: Scene) {
    super(name, scene);
    this._meshes = [];
    for (let i = 0; i < Math.floor(Math.random() * 20 + 10); i++) {
      const floor = MeshBuilder.CreateGround(`room_${i}_floor`, {
        height: Math.floor(Math.random() * 9) + 1 * 4,
        width: Math.floor(Math.random() * 9) + 1 * 4,
      });
      floor.parent = this;
      const position = this.getRandomPointInCircle(40);
      floor.position = new Vector3(position.x, 0, position.z);
      this._meshes.push(floor);
      // console.log(floor.getVertexBuffer(VertexBuffer.PositionKind)?.getData());
      console.log(floor.getVerticesData(VertexBuffer.PositionKind));
      const walls = MeshBuilder.ExtrudePolygon;
    }
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
    return {
      x: radius * r * Math.cos(t),
      z: radius * r * Math.sin(t),
    };
  }
}

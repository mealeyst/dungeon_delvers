"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DungeonGenerator = void 0;
const core_1 = require("@babylonjs/core");
const math_1 = require("@babylonjs/core/Maths/math");
const transformNode_1 = require("@babylonjs/core/Meshes/transformNode");
class DungeonGenerator extends transformNode_1.TransformNode {
    constructor(name, scene) {
        super(name, scene);
        this._meshes = [];
        for (let i = 0; i < Math.floor(Math.random() * 20 + 10); i++) {
            const floor = core_1.MeshBuilder.CreateGround(`room_${i}_floor`, {
                height: Math.floor(Math.random() * 9) + 1 * 4,
                width: Math.floor(Math.random() * 9) + 1 * 4,
            });
            floor.parent = this;
            const position = this.getRandomPointInCircle(40);
            floor.position = new math_1.Vector3(position.x, 0, position.z);
            this._meshes.push(floor);
            // console.log(floor.getVertexBuffer(VertexBuffer.PositionKind)?.getData());
            console.log(floor.getVerticesData(core_1.VertexBuffer.PositionKind));
            const walls = core_1.MeshBuilder.ExtrudePolygon;
        }
    }
    getRandomPointInCircle(radius) {
        const t = 2 * Math.PI * Math.random();
        const u = Math.random() + Math.random();
        let r = null;
        if (u > 1) {
            r = 2 - u;
        }
        else {
            r = u;
        }
        return {
            x: radius * r * Math.cos(t),
            z: radius * r * Math.sin(t),
        };
    }
}
exports.DungeonGenerator = DungeonGenerator;
//# sourceMappingURL=DungeonGenerator.js.map
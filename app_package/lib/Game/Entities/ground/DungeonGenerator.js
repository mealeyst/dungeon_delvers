"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DungeonGenerator = void 0;
const transformNode_1 = require("@babylonjs/core/Meshes/transformNode");
const Room_1 = require("./Room");
class DungeonGenerator extends transformNode_1.TransformNode {
    constructor(name, scene) {
        super(name, scene);
        this._meshes = [];
        for (let i = 0; i < Math.floor(Math.random() * 20 + 10); i++) {
            this._meshes.push(new Room_1.Room(`room_${i}_floor`, scene, this));
        }
    }
}
exports.DungeonGenerator = DungeonGenerator;
//# sourceMappingURL=DungeonGenerator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const core_1 = require("@babylonjs/core");
class Room {
    constructor(name, scene, parent, meshes) {
        const height = Math.floor(Math.random() * 9) + 1 * 4;
        const width = Math.floor(Math.random() * 9) + 1 * 4;
        this._floor = core_1.MeshBuilder.CreateGround(name, {
            height,
            width,
        });
        this.radius = Math.sqrt(height ** 2 + width ** 2);
        this._floor.parent = parent;
        this.position = this.getRandomPointInCircle(20);
        this._floor.position = this.position;
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map
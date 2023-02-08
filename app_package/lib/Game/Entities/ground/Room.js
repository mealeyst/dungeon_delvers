"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const core_1 = require("@babylonjs/core");
class Room {
    constructor(name, scene, parent) {
        const height = Math.floor(Math.random() * 9) + 1 * 4;
        const width = Math.floor(Math.random() * 9) + 1 * 4;
        this._floor = core_1.MeshBuilder.CreateGround(name, {
            height,
            width
        });
        this.radius = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));
        this._floor.parent = parent;
        this.position = this.getRandomPointInCircle(20);
        this._floor.position = this.position;
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
        return new core_1.Vector3(radius * r * Math.cos(t), 0, radius * r * Math.sin(t));
    }
    seperate(meshes) {
        const sum = new core_1.Vector3();
        let count = 0;
        for (let meshID = 0; meshID < meshes.length; meshID++) {
            const desiredSeparation = this.radius + meshes[meshID].radius + (25) + (50);
            var sep = core_1.Vector3.Distance(this.position, meshes[meshID].position);
            if ((sep > 0) && (sep < desiredSeparation)) {
                var thisposition = this.position.clone();
                var diff = thisposition.subtract(meshes[meshID].position);
                diff.normalize();
                diff.divide(new core_1.Vector3(sep, 0, sep));
                sum.add(diff);
                count++;
            }
        }
        if (count > 0) {
            sum.divide(new core_1.Vector3(count, 0, count));
            sum.normalize();
            sum.multiply(new core_1.Vector3(5, 0, 5));
        }
        return sum;
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map
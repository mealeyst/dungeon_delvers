"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomTypes = exports.Corridor = exports.Room = exports.Container = exports.Rectangle = exports.TreeNode = void 0;
const core_1 = require("@babylonjs/core");
class TreeNode {
    constructor(data) {
        this._leaf = data;
    }
    /**
     * This function works to get the bottom most leaves.
     */
    get leaves() {
        const result = [];
        if (this._left && this._right) {
            result.push(...this._left.leaves, ...this._right.leaves);
        }
        else {
            result.push(this._leaf);
        }
        return result;
    }
}
exports.TreeNode = TreeNode;
class Rectangle {
    constructor(x, y, width, length) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.length = length;
    }
    get center() {
        return new core_1.Vector2(this.x + this.width / 2, this.y + this.length / 2);
    }
    get surface() {
        return this.width * this.length;
    }
    get down() {
        return this.y + this.length;
    }
    get right() {
        return this.x + this.width;
    }
}
exports.Rectangle = Rectangle;
class Container extends Rectangle {
    constructor(x, y, width, length) {
        super(x, y, width, length);
    }
}
exports.Container = Container;
class Room extends Rectangle {
    constructor(x, y, id, template) {
        super(x, y, template.width, template.length);
        this.id = id;
        this.template = template;
    }
}
exports.Room = Room;
class Corridor extends Rectangle {
    constructor(x, y, width, length) {
        super(x, y, width, length);
    }
    get direction() {
        return this.width > this.length ? "horizontal" : "vertical";
    }
}
exports.Corridor = Corridor;
/**
 * Rooms
 */
exports.RoomTypes = [
    "entrance",
    "monsters",
    "heal",
    "treasure",
    "boss",
];
//# sourceMappingURL=types.js.map
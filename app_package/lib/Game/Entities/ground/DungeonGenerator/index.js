"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DungeonGenerator = void 0;
var core_1 = require("@babylonjs/core");
var math_1 = require("@babylonjs/core/Maths/math");
var transformNode_1 = require("@babylonjs/core/Meshes/transformNode");
var DungeonGenerator = /** @class */ (function (_super) {
    __extends(DungeonGenerator, _super);
    function DungeonGenerator(name, scene) {
        var _this = _super.call(this, name, scene) || this;
        _this._meshes = [];
        for (var i = 0; i < Math.floor(Math.random() * 10 + 10); i++) {
            var floor = core_1.MeshBuilder.CreateGround("room_".concat(i, "_floor"), {
                height: Math.floor(Math.random() * 30) + 20,
                width: Math.floor(Math.random() * 30) + 20,
                subdivisions: 4,
            });
            floor.parent = _this;
            var position = _this.getRandomPointInCircle(40);
            floor.position = new math_1.Vector3(position.x, 0, position.z);
            _this._meshes.push(floor);
        }
        return _this;
    }
    DungeonGenerator.prototype.getRandomPointInCircle = function (radius) {
        var t = 2 * Math.PI * Math.random();
        var u = Math.random() + Math.random();
        var r = null;
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
    };
    return DungeonGenerator;
}(transformNode_1.TransformNode));
exports.DungeonGenerator = DungeonGenerator;
//# sourceMappingURL=index.js.map
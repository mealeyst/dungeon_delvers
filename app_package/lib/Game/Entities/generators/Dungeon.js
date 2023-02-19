"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dungeon = void 0;
const core_1 = require("@babylonjs/core");
const iInspectable_1 = require("@babylonjs/core/Misc/iInspectable");
const random_1 = require("../../../utils/random");
const types_1 = require("./types");
class Dungeon extends core_1.TransformNode {
    constructor(name, scene, options) {
        super(name, scene);
        const defaultArgs = {
            corridorWidth: 2,
            length: 48,
            iterations: 3,
            minSize: 4,
            ratio: 0.45,
            retries: 30,
            tileWidth: 16,
            width: 64,
        };
        this._corridorWidth = (options === null || options === void 0 ? void 0 : options.corridorWidth) || defaultArgs.corridorWidth;
        this._length = (options === null || options === void 0 ? void 0 : options.length) || defaultArgs.length;
        this._iterations = (options === null || options === void 0 ? void 0 : options.iterations) || defaultArgs.iterations;
        this._minSize = (options === null || options === void 0 ? void 0 : options.minSize) || defaultArgs.minSize;
        this._ratio = (options === null || options === void 0 ? void 0 : options.ratio) || defaultArgs.ratio;
        this._retries = (options === null || options === void 0 ? void 0 : options.retries) || defaultArgs.retries;
        this._tileWidth = (options === null || options === void 0 ? void 0 : options.tileWidth) || defaultArgs.tileWidth;
        this._width = (options === null || options === void 0 ? void 0 : options.width) || defaultArgs.width;
        this._transparentMaterial = new core_1.StandardMaterial("transparentMaterial", scene);
        this._transparentMaterial.alpha = 0;
        this.generateRooms();
        this.inspectableCustomProperties = [
            {
                label: "Dungeon Options",
                propertyName: "dungeon",
                type: iInspectable_1.InspectableType.Tab,
            },
            {
                label: "Width",
                propertyName: "width",
                type: iInspectable_1.InspectableType.Slider,
                min: 30,
                max: 500,
                step: 1,
            },
            {
                label: "Height",
                propertyName: "height",
                type: iInspectable_1.InspectableType.Slider,
                min: 30,
                max: 500,
                step: 1,
            },
            {
                label: "Iterations",
                propertyName: "iterations",
                type: iInspectable_1.InspectableType.Slider,
                min: 3,
                max: 10,
                step: 1,
            },
            {
                label: "Retries",
                propertyName: "retries",
                type: iInspectable_1.InspectableType.Slider,
                min: 8,
                max: 100,
                step: 1,
            },
            {
                label: "Container Size Ratio",
                propertyName: "ratio",
                type: iInspectable_1.InspectableType.Slider,
                min: 0.05,
                max: 1,
                step: 0.05,
            },
            {
                label: "Corridor Width",
                propertyName: "corridorWidth",
                type: iInspectable_1.InspectableType.Slider,
                min: 1,
                max: 4,
                step: 1,
            },
            {
                label: "Tile Width",
                propertyName: "tileWidth",
                type: iInspectable_1.InspectableType.Slider,
                min: 1,
                max: 4,
                step: 1,
            },
            {
                label: "Generate Dungeon",
                propertyName: "generate",
                type: iInspectable_1.InspectableType.Button,
                callback: () => {
                    const children = this.getChildMeshes();
                    children.forEach((child) => child.dispose());
                    this.generateRooms();
                },
            },
        ];
    }
    set corridorWidth(value) {
        this._corridorWidth = value;
    }
    get corridorWidth() {
        return this._corridorWidth;
    }
    set iterations(value) {
        this._iterations = value;
    }
    get iterations() {
        return this._iterations;
    }
    set height(value) {
        this._length = value;
    }
    get height() {
        return this._width;
    }
    set ratio(value) {
        this._ratio = value;
    }
    get ratio() {
        return this._ratio;
    }
    get tileWidth() {
        return this._tileWidth;
    }
    set tileWidth(value) {
        this._tileWidth = value;
    }
    set width(value) {
        this._width = value;
    }
    get width() {
        return this._width;
    }
    createTree(iterations) {
        return this.generateTree(new types_1.Container(0, 0, this._width, this._length), iterations);
    }
    generateTree(container, iterations) {
        // debugger;
        const node = new types_1.TreeNode(container);
        if (iterations !== 0 &&
            node._leaf.width > this._minSize * 2 &&
            node._leaf.length > this._minSize * 2) {
            // We still need to dive the container
            const [left, right] = this.splitContainer(container);
            if (left && right) {
                node._left = this.generateTree(left, iterations - 1);
                node._right = this.generateTree(right, iterations - 1);
            }
        }
        return node;
    }
    splitContainer(container, retries) {
        let left;
        let right;
        retries = retries || this._retries;
        // We tried too many times tos split the container without success
        if (retries === 0) {
            return [null, null];
        }
        // Generate a random direction to split the container
        const direction = (0, random_1.randomChoice)(["horizontal", "vertical"]);
        if (direction === "vertical") {
            // Vertical
            left = new types_1.Container(container.x - container.width / 2, container.y + container.length / 2, (0, random_1.random)(1, container.width), container.length);
            right = new types_1.Container(container.x - container.width / 2 + left.width, container.y + container.length / 2, container.width - left.width, container.length);
            // Retry splitting the container if it's not large enough
            const leftWidthRatio = left.width / left.length;
            const rightWidthRatio = right.width / right.length;
            if (leftWidthRatio < this._ratio || rightWidthRatio < this.ratio) {
                // Decrement amount retires;
                return this.splitContainer(container, retries - 1);
            }
        }
        else {
            // Horizontal
            left = new types_1.Container(container.x - container.width / 2, container.y + container.length / 2, container.width, (0, random_1.random)(1, container.length));
            right = new types_1.Container(container.x - container.width / 2, container.y + container.length / 2 + left.length, container.width, container.length - left.length);
            // Retry splitting the container if it's not high enough
            const leftLengthRatio = left.length / left.width;
            const rightLengthRatio = right.length / right.width;
            if (leftLengthRatio < this._ratio || rightLengthRatio < this._ratio) {
                // Decrement amount of iterations
                return this.splitContainer(container, retries - 1);
            }
        }
        const containerPlane = core_1.MeshBuilder.CreatePlane(`plane_${retries}`, {
            width: container.width,
            height: container.length,
        });
        containerPlane.rotation.x = Math.PI / 2;
        containerPlane.position = new core_1.Vector3(container.x, 0, container.y);
        containerPlane.material = this._transparentMaterial;
        return [left, right];
    }
    generateRooms() {
        const iterations = this._iterations;
        this._tree = this.createTree(iterations);
        console.log(this._tree);
        console.log(this._tree.leaves);
        this._tree.leaves.forEach((leaf, index) => {
            const ground = core_1.MeshBuilder.CreateGround(`room_${index}_floor`, {
                width: leaf.width,
                height: leaf.length,
            });
            ground.parent = this;
            // ground.setPivotPoint(new Vector3(leaf.width / 2, 0, leaf.length));
            ground.position = new core_1.Vector3(leaf.x, 0, leaf.y);
        });
    }
}
exports.Dungeon = Dungeon;
//# sourceMappingURL=Dungeon.js.map
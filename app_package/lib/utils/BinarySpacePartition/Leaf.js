"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaf = void 0;
const MIN_LEAF_SIZE = 20;
function leaf(x, y, width, height) {
    let leftChild = null;
    let rightChild = null;
    function split() {
        if (leftChild !== null && rightChild !== null) {
            return false;
        }
        // Determine to split vertical or horizontal, else split randomly
        const splitH = width > height && width / height >= 1.25
            ? true
            : height > width && height / width >= 1.25
                ? false
                : Math.random() > 0.5;
        const max = splitH ? height : width - MIN_LEAF_SIZE;
        if (max <= MIN_LEAF_SIZE) {
            return false; // Area is too small to split
        }
        const split = Math.floor(Math.random() * max) + MIN_LEAF_SIZE;
        if (splitH) {
            leftChild = leaf(x, y, width, split);
            rightChild = leaf(x, y + split, width, height - split);
        }
        else {
            leftChild = leaf(x, y, split, height);
            rightChild = leaf(x + split, y, width - split, height);
        }
        return true; // Split success!
    }
    return {
        split,
    };
}
exports.leaf = leaf;
//# sourceMappingURL=Leaf.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("../math");
class RandomWrapper {
    constructor() {
        this.values = {};
    }
    Rand(x, y) {
        const k = `${x}.${y}`;
        if (!(k in this.values)) {
            this.values[k] = Math.random() * 2 - 1;
        }
        return this.values[k];
    }
    noise2D(x, y) {
        // Bilinear filter
        const x1 = Math.floor(x);
        const y1 = Math.floor(y);
        const x2 = x1 + 1;
        const y2 = y1 + 1;
        const xp = x - x1;
        const yp = y - y1;
        const p11 = this.Rand(x1, y1);
        const p21 = this.Rand(x2, y1);
        const p12 = this.Rand(x1, y2);
        const p22 = this.Rand(x2, y2);
        const px1 = (0, math_1.lerp)(xp, p11, p21);
        const px2 = (0, math_1.lerp)(xp, p12, p22);
        return (0, math_1.lerp)(yp, px1, px2);
    }
}
exports.default = RandomWrapper;
//# sourceMappingURL=Random.js.map
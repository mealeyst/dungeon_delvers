"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babylonjs/core");
const math_1 = require("../../../utils/math");
class HeightGenerator {
    constructor(generator, position, minRadius, maxRadius) {
        this.position = position.clone();
        this.radius = [minRadius, maxRadius];
        this.generator = generator;
    }
    Get(x, y) {
        const distance = new core_1.Vector2(x, y).length();
        let normalization = 1.0 -
            (0, math_1.sat)((distance - this.radius[0]) / (this.radius[1] - this.radius[0]));
        normalization = normalization * normalization * (3 - 2 * normalization);
        return [this.generator.Get(x, y), normalization];
    }
}
exports.default = HeightGenerator;
//# sourceMappingURL=HeightGenerator.js.map
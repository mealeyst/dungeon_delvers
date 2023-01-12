"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sat = exports.clamp = exports.smootherstep = exports.smoothstep = exports.lerp = exports.randInt = exports.randNormalish = exports.randRange = void 0;
/**
 * Grabbed these math functions from: https://github.com/simondevyoutube/ProceduralTerrain_Part1/blob/master/src/math.js
 */
const randRange = (a, b) => Math.random() * (b - a) + a;
exports.randRange = randRange;
const randNormalish = () => {
    const r = Math.random() + Math.random() + Math.random() + Math.random();
    return (r / 4.0) * 2.0 - 1;
};
exports.randNormalish = randNormalish;
const randInt = (a, b) => Math.round(Math.random() * (b - a) + a);
exports.randInt = randInt;
const lerp = (x, a, b) => x * (b - a) + a;
exports.lerp = lerp;
const smoothstep = (x, a, b) => {
    const smooth = x * x * (3.0 - 2.0 * x);
    return smooth * (b - a) + a;
};
exports.smoothstep = smoothstep;
const smootherstep = (x, a, b) => {
    const result = x * x * x * (x * (x * 6 - 15) + 10);
    return result * (b - a) + a;
};
exports.smootherstep = smootherstep;
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
exports.clamp = clamp;
const sat = (x) => Math.min(Math.max(x, 0.0), 1.0);
exports.sat = sat;
//# sourceMappingURL=index.js.map
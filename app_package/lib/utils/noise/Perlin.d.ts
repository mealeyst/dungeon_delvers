/**
 * A Perlin Noise library for JavaScript.
 *
 * Based on implementations by Ken Perlin (Java, C) & Stefan Gustavson (C).
 *
 * MIT License.
 * Copyright (c) 2018 Leonardo de S.L.F.
 * http://leodeslf.com/
 */
/**
 * Returns a one-dimensional noise value between -1 and 1.
 * @param {number} x A numeric expression.
 * @returns {number} Perlin Noise value.
 */
export declare const perlin1D: (x: number) => number;
/**
 * Returns a two-dimensional noise value between -1 and 1.
 * @param {number} x A numeric expression.
 * @param {number} y A numeric expression.
 * @returns {number} Perlin Noise value.
 */
export declare const perlin2D: (x: number, y: number) => number;
/**
 * Returns a three-dimensional noise value between -1 and 1.
 * @param {number} x A numeric expression.
 * @param {number} y A numeric expression.
 * @param {number} z A numeric expression.
 * @returns {number} Perlin Noise value.
 */
export declare const perlin3D: (x: number, y: number, z: number) => number;
/**
 * Returns a four-dimensional noise value between -1 and 1.
 * @param {number} x A numeric expression.
 * @param {number} y A numeric expression.
 * @param {number} z A numeric expression.
 * @param {number} t A numeric expression.
 * @returns {number} Perlin Noise value.
 */
export declare const perlin4D: (x: number, y: number, z: number, t: number) => number;
declare class PerlinWrapper {
    constructor();
    static noise2D: (x: number, y: number) => number;
}
export default PerlinWrapper;
//# sourceMappingURL=Perlin.d.ts.map
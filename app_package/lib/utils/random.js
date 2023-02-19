"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomChoice = exports.random = void 0;
/**
 * Generate a random number between `min` and `max`.
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.random = random;
/**
 * Return one of the values.
 */
function randomChoice(values) {
    return values[Math.floor(Math.random() * values.length)];
}
exports.randomChoice = randomChoice;
//# sourceMappingURL=random.js.map
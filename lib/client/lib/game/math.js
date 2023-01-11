"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.smoothstep = exports.smootherstep = exports.sat = exports.randRange = exports.randNormalish = exports.randInt = exports.lerp = exports.clamp = void 0;

/**
 * Grabbed these math functions from: https://github.com/simondevyoutube/ProceduralTerrain_Part1/blob/master/src/math.js
 */
var randRange = function randRange(a, b) {
  return Math.random() * (b - a) + a;
};

exports.randRange = randRange;

var randNormalish = function randNormalish() {
  var r = Math.random() + Math.random() + Math.random() + Math.random();
  return r / 4.0 * 2.0 - 1;
};

exports.randNormalish = randNormalish;

var randInt = function randInt(a, b) {
  return Math.round(Math.random() * (b - a) + a);
};

exports.randInt = randInt;

var lerp = function lerp(x, a, b) {
  return x * (b - a) + a;
};

exports.lerp = lerp;

var smoothstep = function smoothstep(x, a, b) {
  var smooth = x * x * (3.0 - 2.0 * x);
  return smooth * (b - a) + a;
};

exports.smoothstep = smoothstep;

var smootherstep = function smootherstep(x, a, b) {
  var result = x * x * x * (x * (x * 6 - 15) + 10);
  return result * (b - a) + a;
};

exports.smootherstep = smootherstep;

var clamp = function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b);
};

exports.clamp = clamp;

var sat = function sat(x) {
  return Math.min(Math.max(x, 0.0), 1.0);
};

exports.sat = sat;
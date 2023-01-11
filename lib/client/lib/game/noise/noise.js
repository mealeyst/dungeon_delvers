"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _perlinNoise = require("@leodeslf/perlin-noise");

var _simplexNoise = _interopRequireDefault(require("simplex-noise"));

var _Random = _interopRequireDefault(require("./Random"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var NoiseGenerator = /*#__PURE__*/function () {
  function NoiseGenerator(params) {
    _classCallCheck(this, NoiseGenerator);

    _defineProperty(this, "params", void 0);

    _defineProperty(this, "noise", void 0);

    this.params = params;
    this.Init();
  }

  _createClass(NoiseGenerator, [{
    key: "Init",
    value: function Init() {
      this.noise = {
        simplex: new _simplexNoise["default"](this.params.seed),
        perlin: {
          noise2D: function noise2D(x, y) {
            return (0, _perlinNoise.perlin2D)(x, y);
          }
        },
        random: new _Random["default"]()
      };
    }
  }, {
    key: "Get",
    value: function Get(x, y) {
      var xs = x / this.params.scale;
      var ys = y / this.params.scale;
      var noiseFunc = this.noise[this.params.noiseType];
      var G = Math.pow(2.0, -this.params.persistence);
      var amplitude = 1.0;
      var frequency = 1.0;
      var normalization = 0;
      var total = 0;

      for (var o = 0; o < this.params.octaves; o += 1) {
        var noiseValue = noiseFunc.noise2D(xs * frequency, ys * frequency) * 0.5 + 0.5;
        total += noiseValue * amplitude;
        normalization += amplitude;
        amplitude *= G;
        frequency *= this.params.lacunarity;
      }

      total /= normalization;
      return Math.pow(total, this.params.exponentiation) * this.params.height;
    }
  }]);

  return NoiseGenerator;
}();

var _default = NoiseGenerator;
exports["default"] = _default;
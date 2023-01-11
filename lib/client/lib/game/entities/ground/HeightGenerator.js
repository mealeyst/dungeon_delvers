"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@babylonjs/core");

var _math = require("../../math");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HeightGenerator = /*#__PURE__*/function () {
  function HeightGenerator(generator, position, minRadius, maxRadius) {
    _classCallCheck(this, HeightGenerator);

    _defineProperty(this, "position", void 0);

    _defineProperty(this, "radius", void 0);

    _defineProperty(this, "generator", void 0);

    this.position = position.clone();
    this.radius = [minRadius, maxRadius];
    this.generator = generator;
  }

  _createClass(HeightGenerator, [{
    key: "Get",
    value: function Get(x, y) {
      var distance = new _core.Vector2(x, y).length();
      var normalization = 1.0 - (0, _math.sat)((distance - this.radius[0]) / (this.radius[1] - this.radius[0]));
      normalization = normalization * normalization * (3 - 2 * normalization);
      return [this.generator.Get(x, y), normalization];
    }
  }]);

  return HeightGenerator;
}();

var _default = HeightGenerator;
exports["default"] = _default;
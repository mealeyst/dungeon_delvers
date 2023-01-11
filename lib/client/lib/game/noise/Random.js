"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _math = require("../math");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var RandomWrapper = /*#__PURE__*/function () {
  function RandomWrapper() {
    _classCallCheck(this, RandomWrapper);

    _defineProperty(this, "values", void 0);

    this.values = {};
  }

  _createClass(RandomWrapper, [{
    key: "Rand",
    value: function Rand(x, y) {
      var k = "".concat(x, ".").concat(y);

      if (!(k in this.values)) {
        this.values[k] = Math.random() * 2 - 1;
      }

      return this.values[k];
    }
  }, {
    key: "noise2D",
    value: function noise2D(x, y) {
      // Bilinear filter
      var x1 = Math.floor(x);
      var y1 = Math.floor(y);
      var x2 = x1 + 1;
      var y2 = y1 + 1;
      var xp = x - x1;
      var yp = y - y1;
      var p11 = this.Rand(x1, y1);
      var p21 = this.Rand(x2, y1);
      var p12 = this.Rand(x1, y2);
      var p22 = this.Rand(x2, y2);
      var px1 = (0, _math.lerp)(xp, p11, p21);
      var px2 = (0, _math.lerp)(xp, p12, p22);
      return (0, _math.lerp)(yp, px1, px2);
    }
  }]);

  return RandomWrapper;
}();

var _default = RandomWrapper;
exports["default"] = _default;
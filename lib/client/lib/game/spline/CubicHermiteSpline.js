"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CubicHermiteSpline = /*#__PURE__*/function () {
  function CubicHermiteSpline(lerp) {
    _classCallCheck(this, CubicHermiteSpline);

    _defineProperty(this, "points", void 0);

    _defineProperty(this, "lerp", void 0);

    this.points = [];
    this.lerp = lerp;
  }

  _createClass(CubicHermiteSpline, [{
    key: "AddPoint",
    value: function AddPoint(t, d) {
      this.points.push([t, d]);
    }
  }, {
    key: "Get",
    value: function Get(t) {
      var p1 = 0;

      for (var i = 0; i < this.points.length; i + 1) {
        if (this.points[i][0] >= t) {
          break;
        }

        p1 = i;
      }

      var p0 = Math.max(0, p1 - 1);
      var p2 = Math.min(this.points.length - 1, p1 + 1);
      var p3 = Math.min(this.points.length - 1, p1 + 2);

      if (p1 === p2) {
        return this.points[p1][1];
      }

      return this.lerp((t - this.points[p1][0]) / (this.points[p2][0] - this.points[p1][0]), this.points[p0][1], this.points[p1][1], this.points[p2][1], this.points[p3][1]);
    }
  }]);

  return CubicHermiteSpline;
}();

var _default = CubicHermiteSpline;
exports["default"] = _default;
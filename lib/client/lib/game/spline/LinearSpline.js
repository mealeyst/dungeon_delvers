"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LinearSpline = /*#__PURE__*/function () {
  function LinearSpline(lerp) {
    _classCallCheck(this, LinearSpline);

    _defineProperty(this, "points", void 0);

    _defineProperty(this, "lerp", void 0);

    this.points = [];
    this.lerp = lerp;
  }

  _createClass(LinearSpline, [{
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

      var p2 = Math.min(this.points.length - 1, p1 + 1);

      if (p1 === p2) {
        return this.points[p1][1];
      }

      return this.lerp((t - this.points[p1][0]) / (this.points[p2][0] - this.points[p1][0]), this.points[p1][1], this.points[p2][1]);
    }
  }]);

  return LinearSpline;
}();

var _default = LinearSpline;
exports["default"] = _default;
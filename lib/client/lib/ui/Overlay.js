"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.OverlayView = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var OverlayView = function OverlayView(_ref) {
  var className = _ref.className,
      children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement("main", {
    className: className
  }, children);
};

exports.OverlayView = OverlayView;
var Overlay = (0, _styledComponents["default"])(OverlayView)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: absolute;\n  bottom: ", ";\n  left: ", ";\n  right: ", ";\n  top: ", ";\n  background: ", ";\n  backdrop-filter: blur(10px);\n"])), function (_ref2) {
  var position = _ref2.position;
  return position && position.bottom ? position.bottom : 0;
}, function (_ref3) {
  var position = _ref3.position;
  return position && position.left ? position.left : 0;
}, function (_ref4) {
  var position = _ref4.position;
  return position && position.right ? position.right : 0;
}, function (_ref5) {
  var position = _ref5.position;
  return position && position.top ? position.top : 0;
}, function (_ref6) {
  var dark = _ref6.dark;
  return dark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.1)';
});
var _default = Overlay;
exports["default"] = _default;
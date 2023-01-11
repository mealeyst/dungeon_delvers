"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CheckboxView = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject;

var _excluded = ["className", "children"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var CheckboxView = function CheckboxView(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/_react["default"].createElement("label", {
    className: className
  }, /*#__PURE__*/_react["default"].createElement("input", _extends({
    type: "checkbox"
  }, props)), /*#__PURE__*/_react["default"].createElement("span", null, children));
};

exports.CheckboxView = CheckboxView;
var Checkbox = (0, _styledComponents["default"])(CheckboxView)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: relative;\n  height: 60px;\n  width: 400px;;\n  display: flex;\n  margin-left: auto;\n  margin-right: auto;\n  margin-bottom: 20px;\n  background: linear-gradient(to right, hsla(0,0%,0%,.0), hsla(0,0%,0%,0.2), hsla(0,0%,0%,0));\n  display: flex;\n  justify-content: center;\n  input[type='checkbox'] {\n    position: absolute !important;\n    height: 1px;\n    width: 1px;\n    overflow: hidden;\n    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */\n    clip: rect(1px, 1px, 1px, 1px);\n  }\n  span {\n    color: #cc9a3d;\n    text-transform: uppercase;\n    display: flex;\n    box-size: border-box;\n    justify-content: center;\n    align-items: center;\n    transition: opacity 0.25s ease-in-out;\n  }\n  span:before {\n    display: block;\n    content: '';\n    background-color: red;\n    height: 20px;\n    width: 20px;\n    background-image: url('./public/checkmark_unchecked.png');\n    transition: background-image 0.2s ease-in-out;\n    background-size: contain;\n    margin-right: 10px;\n  }\n  input:checked + span:before {\n    background-image: url('./public/checkmark_checked.png');\n  }\n"])));
var _default = Checkbox;
exports["default"] = _default;
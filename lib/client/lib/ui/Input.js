"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.InputView = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var InputView = function InputView(_ref) {
  var className = _ref.className,
      label = _ref.label,
      type = _ref.type,
      name = _ref.name;
  return /*#__PURE__*/_react["default"].createElement("label", {
    className: className
  }, /*#__PURE__*/_react["default"].createElement("input", {
    type: type,
    name: name,
    id: name,
    placeholder: " "
  }), /*#__PURE__*/_react["default"].createElement("span", null, label));
};

exports.InputView = InputView;
var Input = (0, _styledComponents["default"])(InputView)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: relative;\n  height: 60px;\n  width: 400px;\n  display: flex;\n  margin-left: auto;\n  margin-right: auto;\n  margin-bottom: 20px;\n  span {\n    color: #cc9a3d;\n    text-transform: uppercase;\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    display: flex;\n    box-size: border-box;\n    justify-content: center;\n    align-items: center;\n    transition: opacity 0.25s ease-in-out;\n  }\n  input {\n    background: linear-gradient(\n      90deg,\n      rgba(29, 41, 41, 1) 0%,\n      rgba(28, 29, 31, 1) 15%,\n      rgba(28, 29, 31, 1) 85%,\n      rgba(29, 41, 41, 1) 100%\n    );\n    box-shadow: inset 0px 0px 1px 1px rgba(0, 0, 0, 0.75),\n      0px 0px 1px 1px rgba(0, 0, 0, 0.75);\n    color: #cc9a3d;\n    border-style: ridge;\n    border-color: #8a7349;\n    border-width: 2px;\n    height: 50px;\n    width: 400px;\n    outline: none;\n    padding: 0px 10px;\n    font-family: \"Bellefair\", serif;\n    font-size: 1rem;\n  }\n  input:focus ~ span,\n  input:not(:placeholder-shown) ~ span {\n    opacity: 0;\n  }\n"])));
var _default = Input;
exports["default"] = _default;
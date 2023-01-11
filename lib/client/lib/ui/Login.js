"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _Overlay = _interopRequireDefault(require("./Overlay"));

var _Input = _interopRequireDefault(require("./Input"));

var _Button = _interopRequireDefault(require("./Button"));

var _Checkbox = _interopRequireDefault(require("./Checkbox"));

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var LoginView = function LoginView(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_react["default"].createElement(_Overlay["default"], {
    className: className
  }, /*#__PURE__*/_react["default"].createElement("header", null, /*#__PURE__*/_react["default"].createElement("img", {
    src: "./public/Game_Title.png",
    alt: "Atla Weathermoor"
  })), /*#__PURE__*/_react["default"].createElement("form", null, /*#__PURE__*/_react["default"].createElement(_Input["default"], {
    type: "text",
    name: "login_username",
    label: "Username"
  }), /*#__PURE__*/_react["default"].createElement(_Input["default"], {
    type: "password",
    name: "login_password",
    label: "Password"
  }), /*#__PURE__*/_react["default"].createElement(_Checkbox["default"], null, "Remember me"), /*#__PURE__*/_react["default"].createElement(_Button["default"], null, "Login")), /*#__PURE__*/_react["default"].createElement("footer", null, /*#__PURE__*/_react["default"].createElement("a", {
    href: "#forgot"
  }, "Forgot Your Password?"), /*#__PURE__*/_react["default"].createElement("a", {
    href: "#create"
  }, "Create Account")));
};

var Login = (0, _styledComponents["default"])(LoginView)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  form {\n    flex-direction: column;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n  }\n  header {\n    align-self: flex-start;\n    width: 100%;\n    display: flex;\n    justify-content: center;\n    span {\n      font-size: 40px;\n      color: #8a7349;\n      padding-top: 60px;\n    }\n  }\n  footer {\n    background-color: #131b1e;\n    align-self: flex-end;\n    width: 100%;\n    height: 60px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    border-top-style: ridge;\n    border-top-color: #8a7349;\n    a {\n      color: #cc9a3d;\n      text-decoration: none;\n      text-transform: uppercase;\n      margin: 0 15px;\n      transition: color 0.25s ease-in-out;\n      &:hover {\n        color: #34badd;\n      }\n    }\n  }\n"])));
var _default = Login;
exports["default"] = _default;
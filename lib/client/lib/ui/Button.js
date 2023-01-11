"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ButtonView = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject;

var _excluded = ["children"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var ButtonView = function ButtonView(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded);

  (0, _react.useEffect)(function () {
    var images = ['./public/Fantasy_Button.png', './public/Fantasy_Button_Hover.png', './public/Fantasy_Button_Click.png'];
    images.forEach(function (image) {
      var newImage = new Image();
      newImage.src = image;
    });
  }, []);
  return /*#__PURE__*/_react["default"].createElement("button", _extends({
    type: "button"
  }, props), children);
};

exports.ButtonView = ButtonView;
var Button = (0, _styledComponents["default"])(ButtonView)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  width: 200px;\n  height: 70px;\n  background-color: transparent;\n  border: none;\n  background-image: url('./public/Fantasy_Button.png');\n  background-size: contain;\n  background-repeat: no-repeat;\n  color: white;\n  margin: 0 auto;\n  font-family: \"Bellefair\", serif;\n  text-transform: uppercase;\n  letter-spacing: 0.2rem;\n  font-size: 1rem;\n  transition: background-image 0.2s ease-in-out, color 0.2s ease-in-out;\n  &:hover {\n    cursor: pointer;\n    background-image: url('./public/Fantasy_Button_Hover.png');\n    color: #d1d1d1;\n  }\n  &:active {\n    background-image: url('./public/Fantasy_Button_Click.png');\n    color:\n  }\n"])));
var _default = Button;
exports["default"] = _default;
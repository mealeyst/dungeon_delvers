"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

require("@babylonjs/inspector");

require("babylonjs-loaders");

var _core = require("@babylonjs/core");

var _react = _interopRequireWildcard(require("react"));

var _reactHelmet = require("react-helmet");

var _reactDom = _interopRequireDefault(require("react-dom"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _SceneComponent = _interopRequireDefault(require("./ui/SceneComponent"));

var _socket = _interopRequireDefault(require("./socket"));

var _ProceduralTerrainDemo = _interopRequireDefault(require("./game/ProceduralTerrainDemo"));

var _templateObject, _templateObject2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var StageStyles = (0, _styledComponents.createGlobalStyle)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  html, body {\n    height: 100%;\n    font-family: 'Bellefair', serif;\n  }\n  body {\n    padding: 0;\n    margin: 0;\n  }\n  .main-stage {\n    width: 100%;\n    height: 100%;\n    box-sizing: border-box;\n  }\n"])));
var box;

var onSceneReady = function onSceneReady(scene) {
  (0, _ProceduralTerrainDemo["default"])(scene);
  scene.debugLayer.show();

  _core.SceneLoader.Append('./public/', 'Warrior.glb', scene, function () {
    console.log('We have loaded');
  });
};
/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */


var onRender = function onRender(scene) {
  if (box !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();
    var rpm = 10;
    box.rotation.y += rpm / 60 * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

var RootView = function RootView(_ref) {
  var className = _ref.className;
  (0, _react.useEffect)(function () {
    _socket["default"].connect();

    console.log(_socket["default"]);
  });
  return /*#__PURE__*/_react["default"].createElement("main", {
    className: className
  }, /*#__PURE__*/_react["default"].createElement(_reactHelmet.Helmet, null, /*#__PURE__*/_react["default"].createElement("link", {
    rel: "preconnect",
    href: "https://fonts.googleapis.com"
  }), /*#__PURE__*/_react["default"].createElement("link", {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "true"
  }), /*#__PURE__*/_react["default"].createElement("link", {
    href: "https://fonts.googleapis.com/css2?family=Bellefair&display=swap",
    rel: "stylesheet"
  })), /*#__PURE__*/_react["default"].createElement(StageStyles, null), /*#__PURE__*/_react["default"].createElement(_SceneComponent["default"], {
    antialias: true,
    onSceneReady: onSceneReady,
    onRender: onRender,
    id: "my-canvas"
  }));
};

var Root = (0, _styledComponents["default"])(RootView)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  width: 100%;\n  height: 100%;\n  position: relative;\n"])));
var main = document.createElement('main');
main.classList.add('main-stage');

_reactDom["default"].render( /*#__PURE__*/_react["default"].createElement(Root, null), document.body.appendChild(main));

console.log('Here we go!');
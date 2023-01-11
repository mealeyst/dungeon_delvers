"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@babylonjs/core");

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject;

var _excluded = ["antialias", "engineOptions", "adaptToDeviceRatio", "sceneOptions", "onRender", "onSceneReady"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var SceneComponentView = function SceneComponentView(_ref) {
  var antialias = _ref.antialias,
      engineOptions = _ref.engineOptions,
      adaptToDeviceRatio = _ref.adaptToDeviceRatio,
      sceneOptions = _ref.sceneOptions,
      onRender = _ref.onRender,
      onSceneReady = _ref.onSceneReady,
      rest = _objectWithoutProperties(_ref, _excluded);

  var reactCanvas = (0, _react.useRef)(null);
  /* eslint-disable consistent-return */

  (0, _react.useEffect)(function () {
    if (reactCanvas.current) {
      var engine = new _core.Engine(reactCanvas.current, antialias, engineOptions, adaptToDeviceRatio);
      var scene = new _core.Scene(engine, sceneOptions);

      if (scene.isReady()) {
        onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce(function (scene) {
          return onSceneReady(scene);
        });
      }

      engine.runRenderLoop(function () {
        if (typeof onRender === 'function') {
          onRender(scene);
        }

        scene.render();
      });

      var resize = function resize() {
        scene.getEngine().resize();
      };

      if (window) {
        window.addEventListener('resize', resize);
      }

      return function () {
        scene.getEngine().dispose();

        if (window) {
          window.removeEventListener('resize', resize);
        }
      };
    }
  }, [reactCanvas]);
  return /*#__PURE__*/_react["default"].createElement("canvas", _extends({
    ref: reactCanvas
  }, rest));
};

var SceneComponent = (0, _styledComponents["default"])(SceneComponentView)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  height: 100%;\n  width: 100%;\n"])));
var _default = SceneComponent;
exports["default"] = _default;
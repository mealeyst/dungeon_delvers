"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ProceduralTerrainDemo = void 0;

var _core = require("@babylonjs/core");

var _dat = require("dat.gui");

var _TerrainChunkManager = _interopRequireDefault(require("./entities/ground/TerrainChunkManager"));

var _TerrainSky = _interopRequireDefault(require("./entities/sky/TerrainSky"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ProceduralTerrainDemo = /*#__PURE__*/_createClass(function ProceduralTerrainDemo(scene) {
  var _this = this;

  _classCallCheck(this, ProceduralTerrainDemo);

  _defineProperty(this, "camera", void 0);

  _defineProperty(this, "canvas", void 0);

  _defineProperty(this, "entities", void 0);

  _defineProperty(this, "gui", void 0);

  _defineProperty(this, "scene", void 0);

  _defineProperty(this, "initializeCamera", function () {
    // This creates and positions a free camera (non-mesh)
    _this.camera = new _core.FreeCamera('camera1', new _core.Vector3(-46.164, 13.312, 42.000), _this.scene); // This targets the camera to scene origin

    _this.camera.setTarget(new _core.Vector3(11.268, -12.038, -10.484)); // This attaches the camera to the canvas


    _this.camera.attachControl(_this.canvas, true);
  });

  _defineProperty(this, "initializeGui", function () {
    _this.gui = new _dat.GUI();

    _this.gui.addFolder('General');
  });

  this.scene = scene;
  this.canvas = this.scene.getEngine().getRenderingCanvas();
  this.entities = {};
  this.initializeGui();
  this.entities.terrain = new _TerrainChunkManager["default"](this.gui, this.scene);
  this.entities.skybox = new _TerrainSky["default"](this.gui, this.scene);
  this.initializeCamera();
});

exports.ProceduralTerrainDemo = ProceduralTerrainDemo;

var _default = function _default(scene) {
  return new ProceduralTerrainDemo(scene);
};

exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@babylonjs/core");

var _materials = require("@babylonjs/materials");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TerrainSky = /*#__PURE__*/_createClass(function TerrainSky(gui, scene) {
  var _this = this;

  _classCallCheck(this, TerrainSky);

  _defineProperty(this, "gui", void 0);

  _defineProperty(this, "guiParams", void 0);

  _defineProperty(this, "light", void 0);

  _defineProperty(this, "scene", void 0);

  _defineProperty(this, "skybox", void 0);

  _defineProperty(this, "skyMaterial", void 0);

  _defineProperty(this, "sunPosition", void 0);

  _defineProperty(this, "setSky", function () {
    _this.skyMaterial.turbidity = _this.guiParams.sky.turbidity;
    _this.skyMaterial.rayleigh = _this.guiParams.sky.rayleigh;
    _this.skyMaterial.luminance = _this.guiParams.sky.luminance;
    _this.skybox.material = _this.skyMaterial;
  });

  _defineProperty(this, "setSun", function () {
    _this.skyMaterial.inclination = _this.guiParams.sun.inclination;
    _this.skyMaterial.azimuth = _this.guiParams.sun.azimuth;
  });

  _defineProperty(this, "initializeGui", function () {
    var skyRollup = _this.gui.addFolder('Sky');

    skyRollup.add(_this.guiParams.sky, 'turbidity', 0, 20).onChange(_this.setSky);
    skyRollup.add(_this.guiParams.sky, 'rayleigh', 0.0, 2.0).onChange(_this.setSky);
    skyRollup.add(_this.guiParams.sky, 'luminance', 0.0, 1.0).onChange(_this.setSky);

    var sunRollup = _this.gui.addFolder('Sun');

    sunRollup.add(_this.guiParams.sun, 'inclination', 0.0, 1.0).onChange(_this.setSun);
    sunRollup.add(_this.guiParams.sun, 'azimuth', 0.0, 1).onChange(_this.setSun);
  });

  this.scene = scene;
  this.gui = gui;
  this.guiParams = {
    sky: {
      luminance: 0.2,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8,
      rayleigh: 0.4,
      turbidity: 1
    },
    sun: {
      inclination: 0.2,
      azimuth: 0.25
    }
  }; // This creates a light, aiming 0,1,0 - to the sky (non-mesh)

  this.sunPosition = new _core.Vector3(0, 100, 0);
  this.light = new _core.HemisphericLight('light', this.sunPosition, this.scene); // Default intensity is 1. Let's dim the light a small amount

  this.light.intensity = 0.7; // this.light = new DirectionalLight('*dir00', new Vector3(0, -1, -1), scene);
  // this.light.position = this.sunPosition;
  // this.light = new SpotLight(
  //   'spot01',
  //   new Vector3(30, 40, 30),
  //   new Vector3(-1, -2, -1),
  //   1.1,
  //   16,
  //   scene,
  // );
  // this.light.setDirectionToTarget(Vector3.Zero());
  // this.light.intensity = 1.5;
  // this.shadowGenerator = new ShadowGenerator(1024, this.light);
  // const ground = this.scene.getMeshByID('ground');
  // if (ground) {
  //   this.shadowGenerator.addShadowCaster(ground);
  // }

  this.skyMaterial = new _materials.SkyMaterial('skyMaterial', this.scene);
  this.skyMaterial.backFaceCulling = false;
  this.skybox = _core.Mesh.CreateBox('skyBox', 1000.0, this.scene);
  this.setSky();
  this.setSun();
  this.initializeGui();
});

var _default = TerrainSky;
exports["default"] = _default;
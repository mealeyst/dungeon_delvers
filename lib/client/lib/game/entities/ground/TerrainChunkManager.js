"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@babylonjs/core");

var _noise = _interopRequireDefault(require("../../noise/noise"));

var _HeightGenerator = _interopRequireDefault(require("./HeightGenerator"));

var _TerrainChunk = _interopRequireDefault(require("./TerrainChunk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// interface Chunk {
//   chunk: TerrainChunk,
//   edges: string[],
// }
var TerrainChunkManager = /*#__PURE__*/_createClass(function TerrainChunkManager(gui, scene) {
  var _this = this;

  _classCallCheck(this, TerrainChunkManager);

  _defineProperty(this, "chunks", void 0);

  _defineProperty(this, "chunkSize", void 0);

  _defineProperty(this, "gui", void 0);

  _defineProperty(this, "guiParams", void 0);

  _defineProperty(this, "noise", void 0);

  _defineProperty(this, "scene", void 0);

  _defineProperty(this, "setNoise", function () {
    if (_this.chunks) {
      Object.values(_this.chunks).forEach(function (_ref) {
        var chunk = _ref.chunk;
        chunk.rebuild();
      });
    }
  });

  _defineProperty(this, "initializeGui", function () {
    var noiseRollup = _this.gui.addFolder('Terrain.Noise');

    noiseRollup.add(_this.guiParams.noise, 'noiseType', ['simplex', 'perlin', 'random']).onChange(_this.setNoise);
    noiseRollup.add(_this.guiParams.noise, 'scale', 64.0, 1024.0).onChange(_this.setNoise);
    noiseRollup.add(_this.guiParams.noise, 'octaves', 1, 20).onChange(_this.setNoise);
    noiseRollup.add(_this.guiParams.noise, 'persistence', 0.01, 2.0).onChange(_this.setNoise);
    noiseRollup.add(_this.guiParams.noise, 'lacunarity', 0.01, 4.0).onChange(_this.setNoise);
    noiseRollup.add(_this.guiParams.noise, 'exponentiation', 0.1, 10.0).onChange(_this.setNoise);
    noiseRollup.add(_this.guiParams.noise, 'height', 0, 256).onChange(_this.setNoise);

    var heightmapRollup = _this.gui.addFolder('Terrain.Heightmap');

    heightmapRollup.add(_this.guiParams.heightmap, 'height', 0, 128).onChange(_this.setNoise);

    var terrainRollup = _this.gui.addFolder('Terrain');

    terrainRollup.add(_this.guiParams.mesh, 'wireframe').onChange(function () {});
  });

  _defineProperty(this, "addChunk", function (x, z) {
    var offset = new _core.Vector2(x * _this.chunkSize, z * _this.chunkSize);
    var chunk = new _TerrainChunk["default"](_this.scene, {
      offset: new _core.Vector3(offset.x, 0, offset.y),
      scale: 1,
      width: _this.chunkSize,
      height: _this.chunkSize,
      subdivisions: 100,
      heightGenerators: [new _HeightGenerator["default"](_this.noise, offset, 100000, 100000 + 1)],
      minHeight: 0
    });
    var k = TerrainChunkManager.key(x, z);
    var edges = [];

    for (var xi = -1; xi <= 1; xi += 1) {
      for (var zi = -1; zi <= 1; zi += 1) {
        if (xi !== 0 || zi !== 0) {
          edges.push(TerrainChunkManager.key(x + xi, z + zi));
        }
      }
    }

    _this.chunks[k] = {
      chunk: chunk,
      edges: edges
    };
  });

  _defineProperty(this, "initializeTerrain", function () {
    _this.chunks = {}; // DEMO
    // this.addChunk(0, 0);

    for (var x = -1; x <= 1; x += 1) {
      for (var z = -1; z <= 1; z += 1) {
        _this.addChunk(x, z);
      }
    }
  });

  this.gui = gui;
  this.scene = scene;
  this.chunkSize = 200;
  this.guiParams = {
    noise: {
      exponentiation: 3.9,
      height: 100,
      lacunarity: 2.0,
      noiseType: 'simplex',
      octaves: 6,
      persistence: 2,
      scale: 125.0,
      seed: 1
    },
    heightmap: {
      height: 16
    },
    mesh: {
      wireframe: false
    }
  };
  this.noise = new _noise["default"](this.guiParams.noise);
  this.setNoise();
  this.initializeTerrain();
  this.initializeGui();
});

_defineProperty(TerrainChunkManager, "key", function (x, z) {
  return "".concat(x, ".").concat(z);
});

var _default = TerrainChunkManager;
exports["default"] = _default;
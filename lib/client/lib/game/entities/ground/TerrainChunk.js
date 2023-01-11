"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@babylonjs/core");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TerrainChunk = /*#__PURE__*/_createClass(function TerrainChunk(scene, chunkParams) {
  var _this = this;

  _classCallCheck(this, TerrainChunk);

  _defineProperty(this, "chunk", void 0);

  _defineProperty(this, "chunkParams", void 0);

  _defineProperty(this, "scene", void 0);

  _defineProperty(this, "rebuild", function () {
    var pos = _this.chunk.getVerticesData(_core.VertexBuffer.PositionKind);

    if (pos !== null) {
      var indices = _this.chunk.getIndices();

      var normals = [];
      var numberOfVertices = pos.length / 3;

      var _loop = function _loop(verticesIndex) {
        var normalization = 0;
        var heightPairs = []; // Verticies

        var x = pos[verticesIndex * 3];
        var y = pos[verticesIndex * 3 + 2];
        var z = 0;

        for (var generatorIndex = 0; generatorIndex < _this.chunkParams.heightGenerators.length; generatorIndex += 1) {
          var gen = _this.chunkParams.heightGenerators[generatorIndex];
          heightPairs.push(gen.Get(x + _this.chunkParams.offset.x, y + _this.chunkParams.offset.z));
          normalization += heightPairs[heightPairs.length - 1][1];
        }

        if (normalization > 0) {
          heightPairs.forEach(function (heightPair) {
            z += heightPair[0] * heightPair[1] / normalization;
          });
        }

        pos[verticesIndex * 3 + 1] = z;
      };

      for (var verticesIndex = 0; verticesIndex < numberOfVertices; verticesIndex += 1) {
        _loop(verticesIndex);
      }

      var groundMaterial = new _core.StandardMaterial('ground', _this.scene);
      groundMaterial.diffuseTexture = new _core.Texture('public/ground.jpg', _this.scene);
      groundMaterial.diffuseTexture.uScale = 6;
      groundMaterial.diffuseTexture.vScale = 6;
      groundMaterial.specularColor = new _core.Color3(0, 0, 0);
      _this.chunk.material = groundMaterial;

      _core.VertexData.ComputeNormals(pos, indices, normals);

      _this.chunk.updateVerticesData(_core.VertexBuffer.PositionKind, pos);

      _this.chunk.updateVerticesData(_core.VertexBuffer.NormalKind, normals);
    }
  });

  this.scene = scene;
  this.chunkParams = chunkParams;
  this.chunk = _core.MeshBuilder.CreateGround('ground', {
    width: this.chunkParams.width,
    height: this.chunkParams.height,
    subdivisions: this.chunkParams.subdivisions,
    updatable: true
  }, this.scene);
  this.chunk.position = chunkParams.offset;
  this.rebuild();
});

var _default = TerrainChunk;
exports["default"] = _default;
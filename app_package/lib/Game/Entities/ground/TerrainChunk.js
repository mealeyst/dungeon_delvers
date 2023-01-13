"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babylonjs/core");
class TerrainChunk {
    constructor(scene, chunkParams, assets) {
        this.rebuild = () => {
            var _a;
            const pos = this.chunk.getVerticesData(core_1.VertexBuffer.PositionKind);
            if (pos !== null) {
                const indices = this.chunk.getIndices();
                const normals = [];
                const numberOfVertices = pos.length / 3;
                for (let verticesIndex = 0; verticesIndex < numberOfVertices; verticesIndex += 1) {
                    let normalization = 0;
                    const heightPairs = [];
                    // Verticies
                    const x = pos[verticesIndex * 3];
                    const y = pos[verticesIndex * 3 + 2];
                    let z = 0;
                    for (let generatorIndex = 0; generatorIndex < this.chunkParams.heightGenerators.length; generatorIndex += 1) {
                        const gen = this.chunkParams.heightGenerators[generatorIndex];
                        heightPairs.push(gen.Get(x + this.chunkParams.offset.x, y + this.chunkParams.offset.z));
                        normalization += heightPairs[heightPairs.length - 1][1];
                    }
                    if (normalization > 0) {
                        heightPairs.forEach((heightPair) => {
                            z += (heightPair[0] * heightPair[1]) / normalization;
                        });
                    }
                    pos[verticesIndex * 3 + 1] = z;
                }
                const groundMaterial = new core_1.StandardMaterial("ground", this.scene);
                groundMaterial.diffuseTexture = this.assets.groundTexture;
                (_a = groundMaterial.diffuseTexture) === null || _a === void 0 ? void 0 : _a.scale(6);
                groundMaterial.specularColor = new core_1.Color3(0, 0, 0);
                this.chunk.material = groundMaterial;
                core_1.VertexData.ComputeNormals(pos, indices, normals);
                this.chunk.updateVerticesData(core_1.VertexBuffer.PositionKind, pos);
                this.chunk.updateVerticesData(core_1.VertexBuffer.NormalKind, normals);
            }
        };
        this.scene = scene;
        this.chunkParams = chunkParams;
        this.assets = assets;
        this.chunk = core_1.MeshBuilder.CreateGround("ground", {
            width: this.chunkParams.width,
            height: this.chunkParams.height,
            subdivisions: this.chunkParams.subdivisions,
            updatable: true,
        }, this.scene);
        this.chunk.position = chunkParams.offset;
        this.rebuild();
    }
}
exports.default = TerrainChunk;
//# sourceMappingURL=TerrainChunk.js.map
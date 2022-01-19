import {
  MeshBuilder,
  Mesh,
  Scene,
  Vector3,
  VertexBuffer,
  StandardMaterial,
  Color3,
  Texture,
} from '@babylonjs/core';
import HeightGenerator from './HeightGenerator';

interface TerrainChunkInterface {
  offset: Vector3;
  scale: number;
  width: number;
  heightGenerators: HeightGenerator[];
}

// const WHITE = new Color3(128, 128, 128); // rgb(128, 128, 128)
// const OCEAN = new Color3(217, 213, 146); // rgb(217, 213, 146)
// const BEACH = new Color3(217, 213, 146); // rgb(217, 213, 146)
// const SNOW = new Color3(255, 255, 255); // rgb(255, 255, 255)
// const FOREST_TROPICAL = new Color3(79, 159, 15); // rgb(79, 159, 15)
// const FOREST_TEMPERATE = new Color3(43, 150, 14); // rgb(43, 150, 14)
// const FOREST_BOREAL = new Color3(41, 193, 0); // rgb(41, 193, 0)

class TerrainChunk {
  chunk: Mesh;

  chunkParams: TerrainChunkInterface;

  scene: Scene;

  constructor(scene: Scene, chunkParams: TerrainChunkInterface) {
    this.scene = scene;
    this.chunkParams = chunkParams;
    this.chunk = MeshBuilder.CreateGround('ground', {
      width: this.chunkParams.width,
      height: this.chunkParams.width,
      subdivisions: 20,
      updatable: true,
    }, this.scene);
    this.chunk.position = chunkParams.offset;
    this.rebuild();
  }

  private rebuild = () => {
    const pos = this.chunk.getVerticesData(VertexBuffer.PositionKind);
    if (pos !== null) {
      const numberOfVertices = pos.length / 3;
      for (let verticesIndex = 0; verticesIndex < numberOfVertices; verticesIndex += 1) {
        let normalization = 0;
        const heightPairs = [];
        // Verticies
        const x = pos[verticesIndex * 3];
        const y = pos[verticesIndex * 3 + 2];
        let z = 0;
        for (
          let generatorIndex = 0;
          generatorIndex < this.chunkParams.heightGenerators.length;
          generatorIndex += 1
        ) {
          const gen = this.chunkParams.heightGenerators[generatorIndex];
          heightPairs.push(gen.Get(x + this.chunkParams.offset.x, y + this.chunkParams.offset.y));
          normalization += heightPairs[heightPairs.length - 1][1];
        }
        if (normalization > 0) {
          heightPairs.forEach((heightPair) => {
            z += (heightPair[0] * heightPair[1]) / normalization;
          });
        }
        pos[verticesIndex * 3 + 1] = z;
      }
      var groundMaterial = new StandardMaterial('ground', this.scene);
      groundMaterial.diffuseTexture = new Texture('public/ground.jpg', this.scene);
      groundMaterial.diffuseTexture.uScale = 6;
      groundMaterial.diffuseTexture.vScale = 6;
      groundMaterial.specularColor = new Color3(0, 0, 0);
      this.chunk.material = groundMaterial;
      this.chunk.updateVerticesData(VertexBuffer.PositionKind, pos);

      // this.chunk.setVerticesData(VertexBuffer.PositionKind, pos, true);
    }
  };

  // Init(params) {
  //   const size = new Vector3(
  //     params.width * params.scale,
  //     0,
  //     params.width * params.scale,
  //   );
    
  //   this.plane = new THREE.Mesh(
  //       new THREE.PlaneGeometry(size.x, size.z, 128, 128),
  //       new THREE.MeshStandardMaterial({
  //           wireframe: false,
  //           color: 0xFFFFFF,
  //           side: THREE.FrontSide,
  //           vertexColors: THREE.VertexColors,
  //       }));
  //   this.plane.position.add(params.offset);
  //   this.plane.castShadow = false;
  //   this.plane.receiveShadow = true;
  //   params.group.add(this.plane);

  //   const colourLerp = (t, p0, p1) => {
  //     const c = p0.clone();

  //     return c.lerpHSL(p1, t);
  //   };
  //   this.colourSpline = [
  //     new LinearSpline(colourLerp),
  //     new LinearSpline(colourLerp),
  //   ];
  //   // Arid
  //   // rgb(183, 166, 125)
  //   this.colourSpline[0].AddPoint(0.0, new Color3(183, 166, 125));
  //   // rgb(241, 225, 188)
  //   this.colourSpline[0].AddPoint(0.5, new Color3(241, 225, 188));
  //   this.colourSpline[0].AddPoint(1.0, SNOW);

  //   // Humid
  //   this.colourSpline[1].AddPoint(0.0, FORESTBOREAL);
  //   // rgb(206, 229, 156)
  //   this.colourSpline[1].AddPoint(0.5, new Color3(206, 229, 156));
  //   this.colourSpline[1].AddPoint(1.0, SNOW);

  //   this.Rebuild();
  // }

  // ChooseColour(x, y, z) {
  //   return WHITE;
  //   const m = this.params.biomeGenerator.Get(x, z);
  //   const h = y / 100.0;

  //   if (h < 0.05) {
  //     return OCEAN;
  //   }

  //   const c1 = this.colourSpline[0].Get(h);
  //   const c2 = this.colourSpline[1].Get(h);

  //   return c1.lerpHSL(c2, m);
  // }

  // Rebuild() {
  //   const colours = [];
  //   const offset = this.params.offset;
  //   for (let v of this.plane.geometry.vertices) {
  //     const heightPairs = [];
  //     let normalization = 0;
  //     v.z = 0;
  //     for (let gen of this.params.heightGenerators) {
  //       heightPairs.push(gen.Get(v.x + offset.x, v.y + offset.y));
  //       
  //     }

  //     if (normalization > 0) {
  //       for (let h of heightPairs) {
  //         v.z += h[0] * h[1] / normalization;
  //       }
  //     }

  //     colours.push(this.ChooseColour(v.x + offset.x, v.z, v.y + offset.y));
  //   }

  //   for (let f of this.plane.geometry.faces) {
  //     const vs = [f.a, f.b, f.c];

  //     const vertexColours = [];
  //     for (let v of vs) {
  //       vertexColours.push(colours[v]);
  //     }
  //     f.vertexColors = vertexColours;
  //   }
  //   this.plane.geometry.elementsNeedUpdate = true;
  //   this.plane.geometry.verticesNeedUpdate = true;
  //   this.plane.geometry.computeVertexNormals();
  // }
}

export default TerrainChunk;

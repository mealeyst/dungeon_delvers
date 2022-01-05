import { spline } from './spline';

class TerrainChunk {
  constructor(params) {
    this.params = params;
    this.Init(params);
  }

  Init(params) {
    const size = new THREE.Vector3(
        params.width * params.scale, 0, params.width * params.scale);

    this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(size.x, size.z, 128, 128),
        new THREE.MeshStandardMaterial({
            wireframe: false,
            color: 0xFFFFFF,
            side: THREE.FrontSide,
            vertexColors: THREE.VertexColors,
        }));
    this.plane.position.add(params.offset);
    this.plane.castShadow = false;
    this.plane.receiveShadow = true;
    params.group.add(this.plane);

    const colourLerp = (t, p0, p1) => {
      const c = p0.clone();

      return c.lerpHSL(p1, t);
    };
    this.colourSpline = [
      new spline.LinearSpline(colourLerp),
      new spline.LinearSpline(colourLerp)
    ];
    // Arid
    this.colourSpline[0].AddPoint(0.0, new THREE.Color(0xb7a67d));
    this.colourSpline[0].AddPoint(0.5, new THREE.Color(0xf1e1bc));
    this.colourSpline[0].AddPoint(1.0, SNOW);

    // Humid
    this.colourSpline[1].AddPoint(0.0, FORESTBOREAL);
    this.colourSpline[1].AddPoint(0.5, new THREE.Color(0xcee59c));
    this.colourSpline[1].AddPoint(1.0, SNOW);

    this.Rebuild();
  }

  ChooseColour(x, y, z) {
    return WHITE;
    const m = this.params.biomeGenerator.Get(x, z);
    const h = y / 100.0;

    if (h < 0.05) {
      return OCEAN;
    }

    const c1 = this.colourSpline[0].Get(h);
    const c2 = this.colourSpline[1].Get(h);

    return c1.lerpHSL(c2, m);
  }

  Rebuild() {
    const colours = [];
    const offset = this.params.offset;
    for (let v of this.plane.geometry.vertices) {
      const heightPairs = [];
      let normalization = 0;
      v.z = 0;
      for (let gen of this.params.heightGenerators) {
        heightPairs.push(gen.Get(v.x + offset.x, v.y + offset.y));
        normalization += heightPairs[heightPairs.length-1][1];
      }

      if (normalization > 0) {
        for (let h of heightPairs) {
          v.z += h[0] * h[1] / normalization;
        }
      }

      colours.push(this.ChooseColour(v.x + offset.x, v.z, v.y + offset.y));
    }

    for (let f of this.plane.geometry.faces) {
      const vs = [f.a, f.b, f.c];

      const vertexColours = [];
      for (let v of vs) {
        vertexColours.push(colours[v]);
      }
      f.vertexColors = vertexColours;
    }
    this.plane.geometry.elementsNeedUpdate = true;
    this.plane.geometry.verticesNeedUpdate = true;
    this.plane.geometry.computeVertexNormals();
  }
}

export default TerrainChunk;

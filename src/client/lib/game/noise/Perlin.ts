const perlin2D = require('@leodeslf/perlin-noise');

class PerlinWrapper {
    constructor () {
    }

  static noise2D = (x:number, y:number) => {
    return perlin2D(x, y) * 2.0 - 1.0;
  };
}

export default PerlinWrapper;

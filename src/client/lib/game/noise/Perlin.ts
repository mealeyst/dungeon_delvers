import { perlin2D } from '@leodeslf/perlin-noise';

class PerlinWrapper {
  static noise2D(x:number, y:number) {
    return perlin2D(x, y) * 2.0 - 1.0;
  }
}

export default PerlinWrapper;

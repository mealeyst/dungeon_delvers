import { Vector2 } from '@babylonjs/core';

import { sat } from './math';

class HeightGenerator {
  private position: any;

  private radius: Array<number>;

  private generator: any;

  constructor(generator:any, position: any, minRadius: number, maxRadius: number) {
    this.position = position.clone();
    this.radius = [minRadius, maxRadius];
    this.generator = generator;
  }

  Get(x: number, y: number) {
    const distance = this.position.distanceTo(new Vector2(x, y));
    let normalization = 1.0 - sat((distance - this.radius[0]) / (this.radius[1] - this.radius[0]));
    normalization = normalization * normalization * (3 - 2 * normalization);

    return [this.generator.Get(x, y), normalization];
  }
}

export default HeightGenerator;

import { Vector2 } from "@babylonjs/core";

import { sat } from "../../../utils/math";
import NoiseGenerator from "../../../utils/noise";

class HeightGenerator {
  private position: Vector2;

  private radius: Array<number>;

  private generator: NoiseGenerator;

  constructor(
    generator: NoiseGenerator,
    position: any,
    minRadius: number,
    maxRadius: number
  ) {
    this.position = position.clone();
    this.radius = [minRadius, maxRadius];
    this.generator = generator;
  }

  Get(x: number, y: number) {
    const distance = new Vector2(x, y).length();
    let normalization =
      1.0 -
      sat((distance - this.radius[0]) / (this.radius[1] - this.radius[0]));
    normalization = normalization * normalization * (3 - 2 * normalization);

    return [this.generator.Get(x, y), normalization];
  }
}

export default HeightGenerator;

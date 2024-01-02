import { Room } from '../../content/stage'
import { Cube } from './cube'

export class Container extends Cube {
  constructor(
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    length: number,
  ) {
    super(x, y, z, width, length, height)
  }
}

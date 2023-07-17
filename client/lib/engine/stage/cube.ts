import { Vector3 } from '@babylonjs/core'

export class Cube {
  x: number
  y: number
  z: number
  width: number
  depth: number
  height: number

  constructor(
    x: number,
    y: number,
    z: number,
    width: number,
    length: number,
    height: number,
  ) {
    this.x = x
    this.y = y
    this.z = z
    this.width = width
    this.depth = length
    this.height = height
  }

  get center(): Vector3 {
    return new Vector3(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.z + this.depth / 2,
    )
  }

  get surface(): number {
    return this.width * this.depth
  }

  get back(): number {
    return this.z + this.depth
  }

  get down(): number {
    return this.y + this.depth
  }

  get right(): number {
    return this.x + this.width
  }
}

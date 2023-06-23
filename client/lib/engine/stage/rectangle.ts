import { Vector3 } from '@babylonjs/core'

export class Rectangle {
  x: number
  y: number
  z: number
  width: number
  length: number

  constructor(x: number, y: number, z: number, width: number, length: number) {
    this.x = x
    this.y = y
    this.z = z
    this.width = width
    this.length = length
  }

  get center(): Vector3 {
    return new Vector3(
      this.x + this.width / 2,
      this.y,
      this.z + this.length / 2,
    )
  }

  get surface(): number {
    return this.width * this.length
  }

  get down(): number {
    return this.y + this.length
  }

  get right(): number {
    return this.x + this.width
  }
}

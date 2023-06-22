import { Vector2 } from '@babylonjs/core'

export class Rectangle {
  x: number
  y: number
  width: number
  length: number

  constructor(x: number, y: number, width: number, length: number) {
    this.x = x
    this.y = y
    this.width = width
    this.length = length
  }

  get center(): Vector2 {
    return new Vector2(this.x + this.width / 2, this.y + this.length / 2)
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

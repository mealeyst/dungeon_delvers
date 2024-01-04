import { Vector3 } from '@babylonjs/core'

export class Cube {
  _x: number
  _y: number
  _z: number
  _width: number
  _depth: number
  _height: number

  constructor(
    x: number,
    y: number,
    z: number,
    width: number,
    length: number,
    height: number,
  ) {
    this._x = x
    this._y = y
    this._z = z
    this._width = width
    this._depth = length
    this._height = height
  }

  get center(): Vector3 {
    return new Vector3(
      this._x + this._width / 2,
      this._y + this._height / 2,
      this._z + this._depth / 2,
    )
  }

  get surface(): number {
    return this._width * this._depth
  }

  get back(): number {
    return this._z + this._depth
  }

  get down(): number {
    return this._y + this._depth
  }

  get right(): number {
    return this._x + this._width
  }
}

import { Matrix, Vector3 } from '@babylonjs/core'

const almostEquals = (a: Vector3, b: Vector3) => {
  return a.subtract(b).lengthSquared() < 0.01
}

export class Tetrahedron {
  private _a: Vector3
  private _b: Vector3
  private _c: Vector3
  private _d: Vector3

  private _isBad = false
  private _circumcenter: Vector3
  private _circumradiusSquared: number

  constructor(a: Vector3, b: Vector3, c: Vector3, d: Vector3) {
    this._a = a
    this._b = b
    this._c = c
    this._d = d
  }

  calculateCircumsphere() {
    const a = Matrix.FromArray([
      this._a._x,
      this._b._x,
      this._c._x,
      this._d._x,
      this._a._y,
      this._b._y,
      this._c._y,
      this._d._y,
      this._a._z,
      this._b._z,
      this._c._z,
      this._d._z,
      1,
      1,
      1,
      1,
    ]).determinant()
    const dx = Matrix.FromArray([
      this._a.lengthSquared(),
      this._b.lengthSquared(),
      this._c.lengthSquared(),
      this._d.lengthSquared(),
      this._a._y,
      this._b._y,
      this._c._y,
      this._d._y,
      this._a._z,
      this._b._z,
      this._c._z,
      this._d._z,
      1,
      1,
      1,
      1,
    ]).determinant()
    const dy = Matrix.FromArray([
      this._a.lengthSquared(),
      this._b.lengthSquared(),
      this._c.lengthSquared(),
      this._d.lengthSquared(),
      this._a._x,
      this._b._x,
      this._c._x,
      this._d._x,
      this._a._z,
      this._b._z,
      this._c._z,
      this._d._z,
      1,
      1,
      1,
      1,
    ]).determinant()
    const dz = Matrix.FromArray([
      this._a.lengthSquared(),
      this._b.lengthSquared(),
      this._c.lengthSquared(),
      this._d.lengthSquared(),
      this._a._x,
      this._b._x,
      this._c._x,
      this._d._x,
      this._a._y,
      this._b._y,
      this._c._y,
      this._d._y,
      1,
      1,
      1,
      1,
    ]).determinant()
    const c = Matrix.FromArray([
      this._a.lengthSquared(),
      this._b.lengthSquared(),
      this._c.lengthSquared(),
      this._d.lengthSquared(),
      this._a._x,
      this._b._x,
      this._c._x,
      this._d._x,
      this._a._y,
      this._b._y,
      this._c._y,
      this._d._y,
      this._a._z,
      this._b._z,
      this._c._z,
      this._d._z,
    ]).determinant()
    this._circumcenter = new Vector3(dx / (2 * a), dy / (2 * a), dz / (2 * a))
    this._circumradiusSquared =
      (dx * dx + dy * dy + dz * dz - 4 * a * c) / (4 * a * a)
  }

  get a() {
    return this._a
  }

  get b() {
    return this._b
  }

  get c() {
    return this._c
  }

  get d() {
    return this._d
  }

  containsVertex(v: Vector3) {
    return (
      almostEquals(v, this._a) ||
      almostEquals(v, this._b) ||
      almostEquals(v, this._c) ||
      almostEquals(v, this._d)
    )
  }

  circumsphereContains(v: Vector3) {
    const dist = v.subtract(this._circumcenter).lengthSquared()
    return dist <= this._circumradiusSquared
  }

  equals(t: Tetrahedron) {
    return (
      (this._a.equals(t.a) ||
        this._a.equals(t.b) ||
        this._a.equals(t.c) ||
        this._a.equals(t.d)) &&
      (this._b.equals(t.a) ||
        this._b.equals(t.b) ||
        this._b.equals(t.c) ||
        this._b.equals(t.d)) &&
      (this._c.equals(t.a) ||
        this._c.equals(t.b) ||
        this._c.equals(t.c) ||
        this._c.equals(t.d)) &&
      (this._d.equals(t.a) ||
        this._d.equals(t.b) ||
        this._d.equals(t.c) ||
        this._d.equals(t.d))
    )
  }
  getHashCode() {
    return (
      this._a.getHashCode() ^
      this._b.getHashCode() ^
      this._c.getHashCode() ^
      this._d.getHashCode()
    )
  }
}

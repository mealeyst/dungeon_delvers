import { Matrix, Scene, Vector3 } from '@babylonjs/core'

type TetrahedronArgs = {
  a: Vector3
  b: Vector3
  c: Vector3
  d: Vector3
}

type TriangleArgs = {
  u: Vector3
  v: Vector3
  w: Vector3
}
type EdgeArgs = {
  u: Vector3
  v: Vector3
}

const almostEqual = (vectA: Vector3, vectB: Vector3) => {
  const diff = vectA.subtract(vectB).lengthSquared()
  return diff < 0.01
}

class Edge {
  _u: Vector3
  _v: Vector3
  constructor(args: EdgeArgs) {
    this._u = args.u
    this._v = args.v
  }
  equals(other: Edge) {
    return (
      (this._u === other._u || this._u === other._v) &&
      (this._v === other._u || this._v === other._v)
    )
  }
  getHashCode() {
    return this._u.getHashCode() ^ this._v.getHashCode()
  }
  almostEqual(other: Edge) {
    return (
      almostEqual(this._u, other._u) ||
      (almostEqual(this._u, other._v) && almostEqual(this._v, other._u)) ||
      almostEqual(this._v, other._v)
    )
  }
}

class Tetrahedron {
  public _a: Vector3
  public _b: Vector3
  public _c: Vector3
  public _d: Vector3
  private _circumcenter: Vector3
  private _circumRadiusSquared: number
  public _isBad: boolean
  constructor(a: Vector3, b: Vector3, c: Vector3, d: Vector3) {
    this._a = a
    this._b = b
    this._c = c
    this._d = d
    this._isBad = false
    const A = Matrix.FromValues(
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
    ).determinant()

    const aPosSqr = this._a.lengthSquared()
    const bPosSqr = this._b.lengthSquared()
    const cPosSqr = this._c.lengthSquared()
    const dPosSqr = this._d.lengthSquared()

    const dx = Matrix.FromValues(
      aPosSqr,
      bPosSqr,
      cPosSqr,
      dPosSqr,
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
    ).determinant()
    const dy = Matrix.FromValues(
      aPosSqr,
      bPosSqr,
      cPosSqr,
      dPosSqr,
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
    ).determinant()
    const dz = Matrix.FromValues(
      aPosSqr,
      bPosSqr,
      cPosSqr,
      dPosSqr,
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
    ).determinant()
    const C = Matrix.FromValues(
      aPosSqr,
      bPosSqr,
      cPosSqr,
      dPosSqr,
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
    ).determinant()
    this._circumcenter = new Vector3(dx / (2 * A), dy / (2 * A), dz / (2 * A))
    this._circumRadiusSquared =
      (dx * dx + dy * dy + dz * dz - 4 * A * C) / (4 * A * A)
  }
  containsVertex(vect: Vector3) {
    return (
      almostEqual(this._a, vect) ||
      almostEqual(this._b, vect) ||
      almostEqual(this._c, vect) ||
      almostEqual(this._d, vect)
    )
  }

  circumCircleContains(vect: Vector3) {
    const dist = vect.subtract(this._circumcenter)
    const distLengthSqr = dist.lengthSquared()
    const result = distLengthSqr <= this._circumRadiusSquared
    return result
  }

  equals(other: Tetrahedron) {
    return (
      (this._a === other._a ||
        this._a === other._b ||
        this._a === other._c ||
        this._a === other._d) &&
      (this._b === other._a ||
        this._b === other._b ||
        this._b === other._c ||
        this._b === other._d) &&
      (this._c === other._a ||
        this._c === other._b ||
        this._c === other._c ||
        this._c === other._d) &&
      (this._d === other._a ||
        this._d === other._b ||
        this._d === other._c ||
        this._d === other._d)
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

  get circumcenter() {
    return this._circumcenter
  }

  set circumcenter(value: Vector3) {
    this._circumcenter = value
  }

  get circumRadiusSquared() {
    return this._circumRadiusSquared
  }

  set circumRadiusSquared(value: number) {
    this._circumRadiusSquared = value
  }
}

class Triangle {
  public _u: Vector3
  public _v: Vector3
  public _w: Vector3
  public _isBad: boolean
  constructor(args: TriangleArgs) {
    this._u = args.u
    this._v = args.v
    this._w = args.w
    this._isBad = false
  }
  equals(other: Triangle) {
    return (
      (this._u === other._u || this._u === other._v || this._u === other._w) &&
      (this._v === other._u || this._v === other._v || this._v === other._w) &&
      (this._w === other._u || this._w === other._v || this._w === other._w)
    )
  }
  getHashCode() {
    return this._u.getHashCode() ^ this._v.getHashCode() ^ this._w.getHashCode()
  }
  almostEqual(other: Triangle) {
    const almostEqualU =
      almostEqual(this._u, other._u) ||
      almostEqual(this._u, other._v) ||
      almostEqual(this._u, other._w)
    const almostEqualV =
      almostEqual(this._v, other._u) ||
      almostEqual(this._v, other._v) ||
      almostEqual(this._v, other._w)
    const almostEqualW =
      almostEqual(this._w, other._u) ||
      almostEqual(this._w, other._v) ||
      almostEqual(this._w, other._w)
    const result = almostEqualU && almostEqualV && almostEqualW
    return result
  }
}

export default class Delaunay {
  private _edges: Set<Edge>
  private _triangles: Set<Triangle>
  private _tetrahedrons: Set<Tetrahedron>
  private _points: Vector3[]
  constructor(points: Vector3[]) {
    this._points = points
    this._edges = new Set<Edge>()
    this._triangles = new Set<Triangle>()
    this._tetrahedrons = new Set<Tetrahedron>()
    this.triangulate()
  }
  public triangulate() {
    let minX = this._points[0]._x
    let minY = this._points[0]._y
    let minZ = this._points[0]._z
    let maxX = minX
    let maxY = minY
    let maxZ = minZ

    this._points.forEach(point => {
      if (point._x < minX) minX = point._x
      if (point._y < minY) minY = point._y
      if (point._z < minZ) minZ = point._z
      if (point._x > maxX) maxX = point._x
      if (point._y > maxY) maxY = point._y
      if (point._z > maxZ) maxZ = point._z
    })

    const dx = maxX - minX
    const dy = maxY - minY
    const dz = maxZ - minZ
    const deltaMax = Math.max(dx, dy, dz)

    const p1 = new Vector3(minX - 1, minY - 1, minZ - 1)
    const p2 = new Vector3(minX + deltaMax, minY - 1, minZ + 1)
    const p3 = new Vector3(minX + 1, minY + deltaMax, minZ - 1)
    const p4 = new Vector3(minX + 1, minY + 1, minZ + deltaMax)

    this._tetrahedrons.add(new Tetrahedron(p1, p2, p3, p4))
    this._points.forEach((point, index) => {
      this._tetrahedrons.forEach(tetrahedron => {
        if (tetrahedron.circumCircleContains(point)) {
          tetrahedron._isBad = true
          this._triangles.add(
            new Triangle({
              u: tetrahedron._a,
              v: tetrahedron._b,
              w: tetrahedron._c,
            }),
          )
          this._triangles.add(
            new Triangle({
              u: tetrahedron._a,
              v: tetrahedron._b,
              w: tetrahedron._d,
            }),
          )
          this._triangles.add(
            new Triangle({
              u: tetrahedron._a,
              v: tetrahedron._c,
              w: tetrahedron._d,
            }),
          )
          this._triangles.add(
            new Triangle({
              u: tetrahedron._b,
              v: tetrahedron._c,
              w: tetrahedron._d,
            }),
          )
        }
      })
      for (const triangleA of this._triangles) {
        for (const triangleB of this._triangles) {
          if (triangleA !== triangleB && triangleA.almostEqual(triangleB)) {
            triangleA._isBad = true
            triangleB._isBad = true
          }
        }
      }
      this._tetrahedrons.forEach(
        tetrahedron =>
          tetrahedron._isBad && this._tetrahedrons.delete(tetrahedron),
      )
      this._triangles.forEach(
        triangle => triangle._isBad && this._triangles.delete(triangle),
      )
      this._triangles.forEach(triangle => {
        this._tetrahedrons.add(
          new Tetrahedron(triangle._u, triangle._v, triangle._w, point),
        )
      })
    })
    this._tetrahedrons.forEach(tetrahedron => {
      if (
        tetrahedron.containsVertex(p1) ||
        tetrahedron.containsVertex(p2) ||
        tetrahedron.containsVertex(p3) ||
        tetrahedron.containsVertex(p4)
      ) {
        this._tetrahedrons.delete(tetrahedron)
      }
    })

    const triangleSet = new Set<Triangle>()

    this._tetrahedrons.forEach(tetrahedron => {
      const abc = new Triangle({
        u: tetrahedron._a,
        v: tetrahedron._b,
        w: tetrahedron._c,
      })
      const abd = new Triangle({
        u: tetrahedron._a,
        v: tetrahedron._b,
        w: tetrahedron._d,
      })
      const acd = new Triangle({
        u: tetrahedron._a,
        v: tetrahedron._c,
        w: tetrahedron._d,
      })
      const bcd = new Triangle({
        u: tetrahedron._b,
        v: tetrahedron._c,
        w: tetrahedron._d,
      })

      if (triangleSet.add(abc)) {
        this._triangles.add(abc)
      }
      if (triangleSet.add(abd)) {
        this._triangles.add(abd)
      }
      if (triangleSet.add(acd)) {
        this._triangles.add(acd)
      }
      if (triangleSet.add(bcd)) {
        this._triangles.add(bcd)
      }

      const ab = new Edge({ u: tetrahedron._a, v: tetrahedron._b })
      const bc = new Edge({ u: tetrahedron._b, v: tetrahedron._c })
      const ca = new Edge({ u: tetrahedron._c, v: tetrahedron._a })
      const da = new Edge({ u: tetrahedron._d, v: tetrahedron._a })
      const db = new Edge({ u: tetrahedron._d, v: tetrahedron._b })
      const dc = new Edge({ u: tetrahedron._d, v: tetrahedron._c })

      this._edges.add(ab)

      this._edges.add(bc)

      this._edges.add(ca)

      this._edges.add(da)

      this._edges.add(db)

      this._edges.add(dc)
    })
  }
  get edges() {
    return this._edges
  }
  get triangles() {
    return this._triangles
  }
}

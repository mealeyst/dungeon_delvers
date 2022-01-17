class CubicHermiteSpline {
  points: number[][];

  lerp: Function;

  constructor(lerp:Function) {
    this.points = [];
    this.lerp = lerp;
  }

  AddPoint(t: number, d: number) {
    this.points.push([t, d]);
  }

  Get(t: number) {
    let p1 = 0;

    for (let i = 0; i < this.points.length; i + 1) {
      if (this.points[i][0] >= t) {
        break;
      }
      p1 = i;
    }

    const p0 = Math.max(0, p1 - 1);
    const p2 = Math.min(this.points.length - 1, p1 + 1);
    const p3 = Math.min(this.points.length - 1, p1 + 2);

    if (p1 === p2) {
      return this.points[p1][1];
    }

    return this.lerp(
      (t - this.points[p1][0]) / (this.points[p2][0] - this.points[p1][0]),
      this.points[p0][1],
      this.points[p1][1],
      this.points[p2][1],
      this.points[p3][1],
    );
  }
}

export default CubicHermiteSpline;

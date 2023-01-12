/**
 * Grabbed these math functions from: https://github.com/simondevyoutube/ProceduralTerrain_Part1/blob/master/src/math.js
 */
export const randRange = (a: number, b: number) => Math.random() * (b - a) + a;

export const randNormalish = () => {
  const r = Math.random() + Math.random() + Math.random() + Math.random();
  return (r / 4.0) * 2.0 - 1;
};

export const randInt = (a: number, b: number) =>
  Math.round(Math.random() * (b - a) + a);

export const lerp = (x: number, a: number, b: number) => x * (b - a) + a;

export const smoothstep = (x: number, a: number, b: number) => {
  const smooth = x * x * (3.0 - 2.0 * x);
  return smooth * (b - a) + a;
};

export const smootherstep = (x: number, a: number, b: number) => {
  const result = x * x * x * (x * (x * 6 - 15) + 10);
  return result * (b - a) + a;
};

export const clamp = (x: number, a: number, b: number) =>
  Math.min(Math.max(x, a), b);

export const sat = (x: number) => Math.min(Math.max(x, 0.0), 1.0);

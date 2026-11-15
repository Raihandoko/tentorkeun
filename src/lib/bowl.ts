/* Glow berbentuk mangkuk, digambar ke canvas kecil lalu direntangkan CSS.
   Fungsi murni supaya mudah diuji. */
export type RGB = [number, number, number];
export interface BowlState { tip: number; half: number; soft: number }

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = (t: number) => {
  t = clamp(t);
  return t * t * (3 - 2 * t);
};
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/* Tabel scroll: q = scrollY / innerHeight */
const Q = [0, 0.03, 0.08, 0.18, 0.4, 0.66, 0.87, 1.15, 1.43, 1.8];
const TIP = [0.3, 0.45, 0.65, 0.8, 0.95, 1.05, 1.05, 1.1, 1.3, 2.4];
const HALF = [0.34, 0.38, 0.38, 0.38, 0.38, 0.46, 0.66, 0.9, 1.6, 3.0];
const SOFT = [0.22, 0.26, 0.22, 0.22, 0.19, 0.16, 0.13, 0.1, 0.1, 0.1];

function lerpTable(q: number, ys: number[]) {
  if (q <= Q[0]) return ys[0];
  for (let i = 1; i < Q.length; i++) {
    if (q <= Q[i]) {
      const t = (q - Q[i - 1]) / (Q[i] - Q[i - 1]);
      return ys[i - 1] + (ys[i] - ys[i - 1]) * t;
    }
  }
  return ys[ys.length - 1];
}
export function targetFor(q: number): BowlState {
  return { tip: lerpTable(q, TIP), half: lerpTable(q, HALF), soft: lerpTable(q, SOFT) };
}

const RND = 0.25;
const SEG = 48;

export function drawBowl(
  data: Uint8ClampedArray,
  W: number,
  H: number,
  aspect: number,
  s: BowlState,
  outside: RGB,
  rim: RGB,
  core: RGB,
) {
  const { tip, half, soft } = s;
  if (tip < 0.03) {
    for (let i = 0; i < W * H; i++) {
      data[i * 4] = outside[0];
      data[i * 4 + 1] = outside[1];
      data[i * 4 + 2] = outside[2];
      data[i * 4 + 3] = 255;
    }
    return;
  }
  const cx: number[] = [];
  const cy: number[] = [];
  for (let i = 0; i <= SEG; i++) {
    const yy = -0.3 + ((tip + 0.3) * i) / SEG;
    const k = Math.max(0, 1 - yy / tip);
    cx.push(half * aspect * Math.pow(k, 0.72));
    cy.push(yy);
  }
  for (let y = 0; y < H; y++) {
    const py = (y + 0.5) / H;
    for (let x = 0; x < W; x++) {
      const px = Math.abs((x + 0.5) / W - 0.5) * aspect;
      let d2 = Infinity;
      for (let i = 0; i < SEG; i++) {
        const ax = cx[i], ay = cy[i];
        const bx = cx[i + 1] - ax, by = cy[i + 1] - ay;
        const len2 = bx * bx + by * by || 1e-9;
        const t = clamp(((px - ax) * bx + (py - ay) * by) / len2);
        const dx = px - (ax + bx * t), dy = py - (ay + by * t);
        const dd = dx * dx + dy * dy;
        if (dd < d2) d2 = dd;
      }
      let sd = Math.sqrt(d2);
      const inside = py < tip && px < half * aspect * Math.pow(Math.max(0, 1 - py / tip), 0.72);
      if (inside) sd = -sd;
      sd -= RND;
      const g = 1 - sm((sd + soft) / (2 * soft));
      const c = g < 0.38 ? mix(outside, rim, sm(g / 0.38)) : mix(rim, core, sm((g - 0.38) / 0.62));
      const o = (y * W + x) * 4;
      data[o] = c[0];
      data[o + 1] = c[1];
      data[o + 2] = c[2];
      data[o + 3] = 255;
    }
  }
}

/** Small numeric helpers shared by the scroll engine and the reveal timing. */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

/** Keeps the value we publish (and write into CSS) free of float noise. */
export function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/** Hermite ramp between two edges — used for every "fade this in over that window" here. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge1 === edge0) return x < edge0 ? 0 : 1;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export const clamp01 = (value: number): number => (value <= 0 ? 0 : value >= 1 ? 1 : value);

export const smoothstep = (x: number): number => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};

/** Round to 4 decimals — used to skip redundant DOM writes while scrubbing. */
export const round4 = (value: number): number => Math.round(value * 10000) / 10000;

/** Half-width of a caption's visible window, in scroll progress. */
export const CAPTION_HALF = 0.14;

/** Opacity of the caption centred on `at`: 0 outside its window, eased inside it. */
export function captionOpacity(progress: number, at: number): number {
  const distance = Math.abs(progress - at);
  if (distance >= CAPTION_HALF) return 0;
  return smoothstep(1 - distance / CAPTION_HALF);
}

/** `$12.99` */
export const money = (value: number): string => `$${value.toFixed(2)}`;

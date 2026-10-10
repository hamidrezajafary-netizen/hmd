/**
 * All imagery is served by Unsplash's CDN with on-the-fly resizing, which keeps the
 * payload small and lets us emit a `srcset` for every breakpoint.
 */
const CDN = 'https://images.unsplash.com/photo-';

export function photo(id: string, width: number): string {
  return `${CDN}${id}?auto=format&fit=crop&w=${width}&q=78`;
}

export function photoSet(id: string, widths: number[] = [640, 960, 1440, 1920]): string {
  return widths.map((w) => `${photo(id, w)} ${w}w`).join(', ');
}

import { useEffect } from 'react';

/**
 * Freezes page scroll while an overlay is open. `overflow: hidden` is used rather than
 * `position: fixed` so the scroll offset — and therefore the video frame the visitor stopped on —
 * survives opening and closing the overlay untouched.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}

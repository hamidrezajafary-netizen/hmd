import { useState } from 'react';

/**
 * True when the visitor asked their OS for reduced motion. Read once on mount: the hero
 * picks its whole layout from this, so reacting to a live change would swap the page
 * structure mid-session.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  return reduced;
}

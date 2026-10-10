import { clamp01 } from './motion';

/** The tall section that owns the scroll runway. */
export const RUNWAY_ID = 'burger-runway';
/** The sticky, full-viewport stage pinned inside the runway. */
export const STAGE_ID = 'burger-stage';

/**
 * Scroll offset where the scrub starts, and the distance in px over which it runs
 * (runway height minus one viewport).
 */
export function measureRunway(): { top: number; span: number } {
  const section = document.getElementById(RUNWAY_ID);
  const stage = document.getElementById(STAGE_ID);
  if (!section || !stage) return { top: 0, span: 1 };
  return {
    top: section.getBoundingClientRect().top + window.scrollY,
    span: Math.max(1, section.offsetHeight - stage.offsetHeight),
  };
}

export function progressFromScroll(): number {
  const { top, span } = measureRunway();
  return clamp01((window.scrollY - top) / span);
}

/** Fly the page to a chapter of the experience (used by the header navigation). */
export function scrollToProgress(progress: number, behavior: ScrollBehavior = 'smooth'): void {
  const { top, span } = measureRunway();
  window.scrollTo({ top: top + clamp01(progress) * span, behavior });
}

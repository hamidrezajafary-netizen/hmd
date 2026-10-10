import { clamp01 } from './motion';

/** The 400vh section that owns the scroll runway. */
export const RUNWAY_ID = 'stage-runway';
/** The full-viewport, sticky stage pinned inside the runway. */
export const STAGE_ID = 'stage-viewport';

export type Runway = {
  /** Document offset where the scrub begins. */
  top: number;
  /** Distance in px the scrub runs over — the runway minus the pinned stage. */
  span: number;
};

/**
 * Measures the runway. Called on mount and on resize only; never from a scroll handler, so
 * scrolling costs no layout reads at all.
 */
export function measureRunway(): Runway {
  const runway = document.getElementById(RUNWAY_ID);
  const stage = document.getElementById(STAGE_ID);
  if (!runway || !stage) return { top: 0, span: 1 };
  return {
    top: runway.getBoundingClientRect().top + window.scrollY,
    span: Math.max(1, runway.offsetHeight - stage.offsetHeight),
  };
}

export function progressFromScroll(runway: Runway): number {
  return clamp01((window.scrollY - runway.top) / runway.span);
}

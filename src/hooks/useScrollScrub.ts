import { useEffect, useRef, useState } from 'react';
import { clamp01, round4, smoothstep } from '@/lib/motion';
import { measureRunway, progressFromScroll, type Runway } from '@/lib/scrub';

/** Fraction of the remaining distance the smoothed progress covers per 60fps frame. */
const SMOOTHING = 0.22;
/** Once this close to the target the loop snaps to it and stops — no endless idle rAF. */
const SETTLED = 0.0004;
/**
 * Smallest change in seconds worth writing to `video.currentTime`. The clip is 24fps
 * (0.0417s per frame), so a smaller delta lands on the frame already on screen — skipping those
 * seeks removes the vast majority of them with no visible difference.
 */
const FRAME_EPSILON = 0.012;
/** Clamp for the frame delta, so a background tab or a long task cannot jump the timeline. */
const MAX_STEP_MS = 64;

export type ScrollScrub = {
  videoRef: React.RefObject<HTMLVideoElement>;
  /** True once the clip can actually be scrubbed (metadata + a decoded frame are available). */
  ready: boolean;
  /** True when the clip could not be used at all, so the caller can fall back to the poster. */
  failed: boolean;
};

/**
 * Turns vertical scroll into `video.currentTime`: the visitor scrubs the timeline instead of
 * playing it. The clip is never played — there is no `play()`, no `autoplay` and no `loop` — it
 * stays paused for its whole life and only ever seeks.
 *
 * How it stays smooth:
 *
 * 1. The scroll and resize listeners are passive and do one cheap thing: cache the *target*
 *    progress. They never touch the video, so a burst of scroll events cannot flood the decoder.
 * 2. A single `requestAnimationFrame` loop owns every DOM write. It eases the displayed progress
 *    toward the target (frame-rate independent) and seeks only once the wanted time has moved by
 *    more than `FRAME_EPSILON`, so redundant seeks are never queued behind a seek in flight.
 * 3. Runway geometry is measured on mount/resize rather than read per scroll event, and
 *    `onProgress` fires from that same loop — so the floating UI follows the scroll without a
 *    single React re-render or extra layout read.
 *
 * `onProgress` is the only channel to the UI: paint from it (styles, CSS vars, attribute flips),
 * never by putting the value into React state on every frame.
 */
export function useScrollScrub(onProgress: (progress: number) => void): ScrollScrub {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Held in a ref so a new callback identity never restarts the loop.
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let canScrub = false;
    let duration = 0;
    let runway: Runway = measureRunway();
    let target = 0;
    let value = 0;
    let lastSeek = -1;
    let raf = 0;
    let frameAt = performance.now();

    const measure = () => {
      runway = measureRunway();
    };

    /** Every DOM write happens here, and only from the rAF loop. */
    const paint = (progress: number) => {
      onProgressRef.current(progress);

      if (!canScrub || duration <= 0 || video.readyState < 2) return;

      const desired = Math.min(progress * duration, duration - 0.001);
      // While a seek is still in flight only a larger move is worth queueing.
      const epsilon = video.seeking ? FRAME_EPSILON * 3 : FRAME_EPSILON;
      if (lastSeek < 0 || Math.abs(desired - lastSeek) >= epsilon) {
        lastSeek = desired;
        video.currentTime = desired;
      }
    };

    const loop = (now: number) => {
      raf = 0;
      const dt = Math.min(MAX_STEP_MS, Math.max(0, now - frameAt));
      frameAt = now;

      const diff = target - value;
      if (Math.abs(diff) <= SETTLED) value = target;
      else value += diff * (1 - Math.pow(1 - SMOOTHING, dt / 16.667));

      paint(round4(value));

      if (value !== target) raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (raf) return;
      frameAt = performance.now();
      raf = requestAnimationFrame(loop);
    };

    /** Scroll handler: cache the target and wake the loop. Nothing else. */
    const onScroll = () => {
      const next = progressFromScroll(runway);
      if (next === target) return;
      target = next;
      wake();
    };

    const onResize = () => {
      measure();
      target = progressFromScroll(runway);
      value = target; // geometry moved under the visitor: follow it instantly
      paint(round4(value));
      wake();
    };

    // --- clip readiness ------------------------------------------------------
    const onMeta = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
    };

    const onReady = () => {
      if (canScrub) return;
      onMeta();
      if (duration <= 0) return;
      canScrub = true;
      // Catch up to wherever the visitor already scrolled, then reveal the stage.
      measure();
      target = progressFromScroll(runway);
      value = target;
      paint(round4(value));
      setReady(true);
    };

    const onVideoError = () => {
      canScrub = false;
      setFailed(true);
    };

    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);
    video.addEventListener('error', onVideoError);
    // The element may already be past metadata/data by the time this effect runs.
    if (video.readyState >= 1) onMeta();
    if (video.readyState >= 2) onReady();

    measure();
    target = progressFromScroll(runway);
    value = target;
    paint(round4(value));

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('error', onVideoError);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return { videoRef, ready, failed };
}

/** Scroll offsets the reveal and the opening cue are tuned against. */
export const REVEAL_IN = 0.86;
export const REVEAL_OUT = 0.8;
export const CUE_FADE_START = 0.004;
export const CUE_FADE_END = 0.07;

/** Opacity for the "scroll down to enter" cue at a given scrub progress. */
export function cueOpacity(progress: number): number {
  return 1 - smoothstep(CUE_FADE_START, CUE_FADE_END, progress);
}

/** Hysteresis so the hotspot overlay cannot flicker when the visitor hovers the threshold. */
export function nextRevealed(current: boolean, progress: number): boolean {
  return current ? progress >= REVEAL_OUT : progress >= REVEAL_IN;
}

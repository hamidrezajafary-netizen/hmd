import { useEffect, useRef, useState } from 'react';
import { clamp01, round4 } from '@/lib/motion';
import { measureRunway } from '@/lib/scrub';

/** Fraction of the remaining distance the smoothed progress covers per 60fps frame. */
const SMOOTHING = 0.2;
/** Once this close to the target the loop snaps and stops — no endless idle rAF. */
const SETTLED = 0.0004;
/**
 * Smallest change in seconds worth writing to `video.currentTime`. The clip is 24fps
 * (0.0417s per frame), so anything under ~0.012s lands on the frame already on screen —
 * skipping it removes the vast majority of seeks with no visible difference.
 */
const FRAME_EPSILON = 0.012;
/** Clamp for the frame delta so a background tab or a long task cannot jump the timeline. */
const MAX_STEP_MS = 64;

export type ScrollVideoScrub = {
  videoRef: React.RefObject<HTMLVideoElement>;
  /** True once the clip can actually be scrubbed (metadata + a decoded frame are available). */
  ready: boolean;
  /** True if the clip could not be used at all, so the caller can fall back to the poster. */
  failed: boolean;
};

/**
 * Turns page scroll into `video.currentTime`, i.e. the visitor scrubs the timeline instead of
 * playing it. The clip is never played: no `play()`, no `autoplay`, no `loop` — it stays paused
 * for its whole life and only ever seeks.
 *
 * How it stays smooth:
 *
 * 1. Scroll/resize handlers are passive and do one cheap thing — cache the *target* progress.
 *    They never touch the video, so a burst of scroll events cannot flood the decoder.
 * 2. A single `requestAnimationFrame` loop owns all DOM writes. It eases the displayed progress
 *    toward the target (frame-rate independent) and seeks only when the wanted time moved by more
 *    than `FRAME_EPSILON` since the last seek, so no redundant seeks are queued while the browser
 *    is still finishing the previous one.
 * 3. Section offsets are measured on mount/resize instead of being read on every scroll event, and
 *    `onProgress` is called from the same loop, so the floating UI follows the scroll without a
 *    single React re-render or extra layout read.
 */
export function useScrollVideoScrub(onProgress: (progress: number) => void): ScrollVideoScrub {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Kept in a ref so a new callback identity never re-runs the effect (and never restarts the loop).
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let canScrub = false;
    let duration = 0;
    let runwayTop = 0;
    let runwaySpan = 1;
    let target = 0;
    let value = 0;
    let lastSeek = -1;
    let raf = 0;
    let frameAt = performance.now();

    /** Cache the runway geometry — never read layout from a scroll handler. */
    const measure = () => {
      const { top, span } = measureRunway();
      runwayTop = top;
      runwaySpan = span;
    };

    const readProgress = () => clamp01((window.scrollY - runwayTop) / runwaySpan);

    /** All DOM writes live here — called from the rAF loop only. */
    const paint = (progress: number) => {
      onProgressRef.current(progress);

      if (!canScrub || duration <= 0 || video.readyState < 2) return;

      const desired = Math.min(progress * duration, duration - 0.001);
      // While the browser is still completing a seek, only larger moves are worth queueing.
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

    /** Scroll handler: only caches the target and wakes the loop. */
    const onScroll = () => {
      const next = readProgress();
      if (next === target) return;
      target = next;
      wake();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      value = target; // geometry changed under the visitor: follow it instantly
      paint(round4(value));
      wake();
    };

    // --- video readiness ----------------------------------------------------
    const onMeta = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
    };

    const onReady = () => {
      if (canScrub) return;
      onMeta();
      if (duration <= 0) return;
      canScrub = true;
      // Catch up to wherever the visitor already scrolled to, then reveal.
      measure();
      target = readProgress();
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
    target = readProgress();
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

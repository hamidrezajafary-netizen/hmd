import { useEffect, useRef, useState } from 'react';

/** Fraction of the remaining distance the smoothed progress covers per 60fps frame. */
const SMOOTHING = 0.2;
/** Once this close to the target the loop snaps and stops — no endless idle rAF. */
const SETTLED = 0.0004;
/**
 * Smallest change in seconds worth writing to `video.currentTime`. The clip is 24fps
 * (0.0417s per frame), so anything under ~0.012s lands on the frame that is already on
 * screen — skipping it removes the vast majority of seeks with no visible difference.
 */
const FRAME_EPSILON = 0.012;
/** Clamp for the frame delta so a background tab or a long task cannot jump the timeline. */
const MAX_STEP_MS = 64;
/** Fraction of the timeline over which the hero copy fades away. */
const COPY_FADE = 0.16;
/** Fraction of the timeline over which the scroll cue fades away (quicker than the copy). */
const CUE_FADE = 0.06;

const clamp01 = (value: number) => (value <= 0 ? 0 : value >= 1 ? 1 : value);
const smoothstep = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};

/**
 * Turns page scroll into `video.currentTime`, i.e. the visitor scrubs the timeline instead of
 * playing it. The video is never played: no `play()`, no `autoplay`, no `loop` — it is paused
 * for its whole life and only ever seeks.
 *
 * How it stays smooth:
 *
 * 1. Scroll/resize handlers are passive and do one cheap thing — cache the *target* progress.
 *    They never touch the video, so a burst of scroll events cannot flood the decoder.
 * 2. A single `requestAnimationFrame` loop owns all DOM writes. It eases the displayed
 *    progress toward the target (frame-rate independent) and seeks only when the wanted time
 *    moved by more than `FRAME_EPSILON` since the last seek, so no redundant seeks are issued
 *    while the browser is still finishing the previous one.
 * 3. Section offsets are measured on mount/resize instead of read on every scroll event, and
 *    the hero copy fades through refs (transform/opacity) rather than React state — scrolling
 *    causes zero re-renders and zero layout reads.
 *
 * Returns the refs the hero attaches plus `ready`, which flips once when the video can be
 * scrubbed. If the video fails outright, `onError` is called so the caller can drop the whole
 * scroll runway and show its static hero instead.
 */
export function useScrollVideoScrub(onError: () => void) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!section || !stage || !video) return;

    let canScrub = false;
    let duration = 0;
    let sectionTop = 0;
    let scrollSpan = 1;
    let target = 0;
    let value = 0;
    let lastSeek = -1;
    let raf = 0;
    let frameAt = performance.now();
    let paintedCopyFade = -1;
    let paintedCueFade = -1;

    /** Cache the section geometry: scrollTop of the section + the scrub runway in px. */
    const measure = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      scrollSpan = Math.max(1, section.offsetHeight - stage.offsetHeight);
    };

    const readProgress = () => clamp01((window.scrollY - sectionTop) / scrollSpan);

    /** All DOM writes live here — called from the rAF loop only. */
    const paint = (progress: number) => {
      // Until the video can be scrubbed, the hero stays a normal still hero: the copy keeps
      // full opacity (rather than half-faded over a frozen poster on a slow connection) and
      // nothing seeks. The runway is never taken away, so the page is never scroll-locked.
      const p = canScrub ? progress : 0;

      const copyFade = smoothstep(p / COPY_FADE);
      if (Math.abs(copyFade - paintedCopyFade) > 0.002 || (copyFade === 1 && paintedCopyFade !== 1)) {
        paintedCopyFade = copyFade;
        const copy = copyRef.current;
        if (copy) {
          copy.style.opacity = String(1 - copyFade);
          copy.style.transform = `translate3d(0, ${(-28 * copyFade).toFixed(2)}px, 0)`;
          // Fully faded copy must not keep capturing clicks or keyboard focus.
          copy.style.visibility = copyFade > 0.995 ? 'hidden' : '';
        }
      }

      const cueFade = clamp01(p / CUE_FADE);
      if (Math.abs(cueFade - paintedCueFade) > 0.002) {
        paintedCueFade = cueFade;
        const cue = cueRef.current;
        if (cue) cue.style.opacity = String(1 - cueFade);
      }

      if (!canScrub || duration <= 0 || video.readyState < 2) return;

      const desired = Math.min(p * duration, duration - 0.001);
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

      paint(value);

      if (value !== target) raf = requestAnimationFrame(loop);
    };

    /** Scroll handler: only caches the target and wakes the loop. */
    const onScroll = () => {
      const next = readProgress();
      if (next === target) return;
      target = next;
      if (!raf) {
        frameAt = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const onResize = () => {
      measure();
      target = readProgress();
      value = target; // geometry changed under the visitor: follow it instantly
      paint(value);
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // --- video readiness ----------------------------------------------------
    const onMeta = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
    };

    const showBuffered = () => {
      const bar = barRef.current;
      if (!bar) return;
      if (!video.duration) return;
      const ranges = video.buffered;
      let end = 0;
      for (let i = 0; i < ranges.length; i += 1) end = Math.max(end, ranges.end(i));
      const ratio = clamp01(end / video.duration);
      bar.style.transform = `scaleX(${ratio})`;
      bar.style.opacity = ratio >= 0.999 ? '0' : '1';
    };

    const onReady = () => {
      if (canScrub) return;
      onMeta();
      canScrub = true;
      // Catch up to wherever the visitor already scrolled to, then reveal.
      measure();
      target = readProgress();
      value = target;
      paint(value);
      setReady(true);
      showBuffered();
    };

    const onVideoError = () => {
      canScrub = false;
      onErrorRef.current();
    };

    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);
    video.addEventListener('progress', showBuffered);
    video.addEventListener('error', onVideoError);
    // The element may already be past metadata by the time this effect runs.
    if (video.readyState >= 1) onMeta();
    if (video.readyState >= 2) onReady();

    measure();
    target = readProgress();
    value = target;
    paint(value);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });

    // Section height is viewport-relative, but fonts/zoom can still shift its offset.
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    observer.observe(stage);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('progress', showBuffered);
      video.removeEventListener('error', onVideoError);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return { sectionRef, stageRef, videoRef, copyRef, cueRef, barRef, ready };
}

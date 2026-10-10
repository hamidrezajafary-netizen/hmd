import { useCallback, useRef } from 'react';
import { chapters } from '@/data/site';
import { useScrollVideoScrub } from '@/hooks/useScrollVideoScrub';
import { cx } from '@/lib/cx';
import { captionOpacity, clamp01, round4, smoothstep } from '@/lib/motion';
import { RUNWAY_ID, STAGE_ID } from '@/lib/scrub';
import ChapterCaptions from './ChapterCaptions';
import { BURGER_POSTER_SRC, BURGER_VIDEO_SRC } from './heroMedia';
import OrderPanel from './OrderPanel';
import ScrollCue from './ScrollCue';

/** Progress at which the "scroll to explore" cue has completely faded away. */
const CUE_FADE = 0.05;
/** Progress over which the desktop order panel settles into place. */
const PANEL_SETTLE = 0.09;

/**
 * The whole experience: a full-viewport video stage pinned inside a tall scroll runway, with the
 * floating UI on top of it. Scrolling scrubs the clip — the burger layers come apart on the way
 * down and stack back together on the way up — and the overlays follow that same progress.
 */
export default function BurgerHero() {
  const cueRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  /** Last painted overlay values, so a frame that changes nothing writes nothing. */
  const painted = useRef({ cue: -1, panel: -1, captions: chapters.map(() => -1) });
  const desktop = useRef<MediaQueryList | null>(null);

  if (desktop.current === null && typeof window !== 'undefined') {
    desktop.current = window.matchMedia('(min-width: 1024px)');
  }

  /**
   * Runs inside the scrub loop's animation frame — every write below is a direct DOM style
   * mutation, so scrubbing never re-renders React.
   */
  const paint = useCallback((progress: number) => {
    const state = painted.current;

    // 1. Scroll cue: gone as soon as the visitor starts moving.
    const cue = round4(1 - clamp01(progress / CUE_FADE));
    if (cue !== state.cue) {
      state.cue = cue;
      const element = cueRef.current;
      if (element) {
        element.style.opacity = String(cue);
        element.style.visibility = cue < 0.02 ? 'hidden' : 'visible';
      }
    }

    // 2. Chapter captions crossfade through the layers of the burger.
    chapters.forEach((chapter, index) => {
      const opacity = round4(captionOpacity(progress, chapter.at));
      if (opacity === state.captions[index]) return;
      state.captions[index] = opacity;
      const element = captionRefs.current[index];
      if (!element) return;
      element.style.opacity = String(opacity);
      element.style.visibility = opacity < 0.02 ? 'hidden' : 'visible';
      element.style.transform = `translate3d(0, ${((1 - opacity) * 16).toFixed(2)}px, 0)`;
    });

    // 3. Order panel settles into place as the burger opens. Only on desktop: below `lg` the
    //    panel is a bottom sheet that has to stay put and reachable while scrolling.
    const isDesktop = desktop.current ? desktop.current.matches : true;
    if (!isDesktop) {
      if (state.panel !== 1) {
        state.panel = 1;
        const element = panelRef.current;
        if (element) element.style.transform = '';
      }
      return;
    }

    const settle = round4(smoothstep(progress / PANEL_SETTLE));
    if (settle === state.panel) return;
    state.panel = settle;
    const element = panelRef.current;
    if (element) {
      element.style.transform = `translate3d(0, ${((1 - settle) * 18).toFixed(2)}px, 0) scale(${(0.98 + 0.02 * settle).toFixed(4)})`;
    }
  }, []);

  const { videoRef, ready, failed } = useScrollVideoScrub(paint);

  return (
    <section id={RUNWAY_ID} className="relative h-[320svh] sm:h-[360svh] lg:h-[400svh]">
      <div id={STAGE_ID} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Poster underneath: the stage is never black, and it is all that shows if the clip fails. */}
        <img
          src={BURGER_POSTER_SRC}
          alt=""
          aria-hidden="true"
          className={cx(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            ready ? 'opacity-0' : 'opacity-100',
          )}
        />

        {!failed && (
          <video
            ref={videoRef}
            src={BURGER_VIDEO_SRC}
            poster={BURGER_POSTER_SRC}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
          />
        )}

        {/* Vignette + top/bottom scrim so the floating UI stays readable over the bright plate. */}
        <div className="stage-scrim pointer-events-none absolute inset-0" aria-hidden="true" />

        <ScrollCue ref={cueRef} />
        <ChapterCaptions refs={captionRefs} />

        {/* Positioning wrapper (keeps its own centring transform) around the painted panel. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 sm:px-5 lg:inset-x-auto lg:bottom-auto lg:left-8 lg:top-1/2 lg:w-[400px] lg:-translate-y-1/2 lg:px-0 xl:left-14">
          <div ref={panelRef} className="animate-sheet pointer-events-auto w-full lg:animate-none">
            <OrderPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

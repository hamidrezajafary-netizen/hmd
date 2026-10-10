import { cx } from '@/lib/cx';
import { HeroCopy } from '@/components/sections/HeroCopy';
import { HERO_POSTER_SRC, HERO_VIDEO_SRC } from '@/components/sections/heroMedia';
import { useScrollVideoScrub } from '@/hooks/useScrollVideoScrub';

/**
 * Scroll-driven hero: a tall section pins a full-viewport stage while the visitor's scroll
 * position scrubs the video timeline from its first to its last frame. See
 * `useScrollVideoScrub` for the engine and `heroMedia.ts` for how the clip is encoded.
 *
 * The runway is 300svh on desktop (≈2 viewports of scrolling for the 9s clip) and a little
 * shorter on phones, where each thumb drag covers less ground.
 */
export function HeroScroll({ onError }: { onError: () => void }) {
  const { sectionRef, stageRef, videoRef, copyRef, cueRef, barRef, ready } =
    useScrollVideoScrub(onError);

  return (
    <section ref={sectionRef} className="relative isolate h-[260svh] bg-navy-950 sm:h-[300svh]">
      <div ref={stageRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
          {/* First frame of the clip: the video fades in over it, so nothing flashes black. */}
          <img
            src={HERO_POSTER_SRC}
            alt=""
            loading="eager"
            decoding="sync"
            className="h-full w-full object-cover"
          />

          {/* Paused for its whole life and moved only by `currentTime` — never autoplayed or looped. */}
          <video
            ref={videoRef}
            src={HERO_VIDEO_SRC}
            preload="auto"
            muted
            playsInline
            disablePictureInPicture
            className={cx(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-premium',
              ready ? 'opacity-100' : 'opacity-0',
            )}
          />

          {/* Deliberately light: the footage stays the subject, the copy keeps a soft scrim. */}
          <div className="absolute inset-0 bg-navy-950/30" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_10%,rgba(6,18,35,0.06)_0%,rgba(6,18,35,0.6)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/80 to-transparent" />
        </div>

        <div className="relative flex h-full flex-col pb-14 pt-[124px] sm:pt-[148px]">
          {/* Faded and lifted out of the way by the scrub engine as the scene starts moving. */}
          <div
            ref={copyRef}
            className="shell flex flex-1 flex-col items-center justify-center text-center"
          >
            <HeroCopy />
          </div>

          <div className="shell hidden justify-center sm:flex">
            <a
              ref={cueRef}
              href="#who-we-are"
              className="group inline-flex flex-col items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-white/50 transition-colors hover:text-white/80"
            >
              Scroll to discover
              <span className="h-10 w-px bg-gradient-to-b from-champagne/80 to-transparent transition-transform duration-500 group-hover:translate-y-1" />
            </a>
          </div>
        </div>

        {/* Minimal buffering treatment: a hairline that fills as the clip arrives. */}
        <span
          aria-hidden="true"
          className={cx(
            'pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-700',
            ready ? 'opacity-0' : 'opacity-100',
          )}
        >
          <span
            ref={barRef}
            className="block h-px origin-left scale-x-0 bg-champagne/70 transition-[transform,opacity] duration-300 ease-premium"
          />
        </span>
      </div>
    </section>
  );
}

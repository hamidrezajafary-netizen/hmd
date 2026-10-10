import { useState } from 'react';
import { photo, photoSet } from '@/lib/images';
import { HeroCopy } from '@/components/sections/HeroCopy';
import { HeroScroll } from '@/components/sections/HeroScroll';
import { HERO_FALLBACK_IMAGE } from '@/components/sections/heroMedia';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * The original photographic hero. Used when the visitor asks for reduced motion — the
 * cinematic scroll experience is never forced on them — and if the video cannot be used at
 * all, so the page always has a working hero.
 */
function HeroStatic() {
  return (
    <section className="relative isolate flex min-h-[88svh] flex-col justify-start overflow-hidden bg-navy-950 pb-16 pt-[124px] sm:min-h-[92svh] sm:pt-[148px] lg:min-h-[94svh] lg:pb-20">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={photo(HERO_FALLBACK_IMAGE, 1920)}
          srcSet={photoSet(HERO_FALLBACK_IMAGE, [960, 1440, 1920, 2400])}
          sizes="100vw"
          alt=""
          loading="eager"
          decoding="sync"
          className="animate-hero-zoom h-full w-full scale-[1.02] object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-950/55" />
        <div className="absolute inset-0 bg-[radial-gradient(115%_75%_at_50%_8%,rgba(6,18,35,0.25)_0%,rgba(6,18,35,0.72)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/85 to-transparent" />
      </div>

      <div className="shell relative flex flex-1 flex-col items-center justify-center text-center">
        <HeroCopy />
      </div>

      <div className="shell relative mt-14 hidden justify-center sm:flex">
        <a
          href="#who-we-are"
          className="group inline-flex flex-col items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-white/50 transition-colors hover:text-white/80"
        >
          Scroll to discover
          <span className="h-10 w-px bg-gradient-to-b from-champagne/80 to-transparent transition-transform duration-500 group-hover:translate-y-1" />
        </a>
      </div>
    </section>
  );
}

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);

  if (reducedMotion || videoFailed) return <HeroStatic />;

  return <HeroScroll onError={() => setVideoFailed(true)} />;
}

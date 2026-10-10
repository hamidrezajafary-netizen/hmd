import { useCallback, useRef, useState } from 'react';
import { HotspotOverlay } from '@/components/HotspotOverlay';
import { ScrollCue } from '@/components/ScrollCue';
import { STAGE_POSTER_SRC, STAGE_VIDEO_SRC } from '@/data/media';
import type { Burger } from '@/data/menu';
import {
  cueOpacity,
  nextRevealed,
  useScrollScrub,
} from '@/hooks/useScrollScrub';
import { smoothstep } from '@/lib/motion';
import { RUNWAY_ID, STAGE_ID } from '@/lib/scrub';

/**
 * The whole experience: a 400vh runway whose first viewport is a sticky stage. Scrolling the
 * runway scrubs the clip from the street door to the display case, and the hotspot overlay is
 * revealed once the clip has arrived there.
 *
 * Everything that moves with the scroll is painted from `handleProgress` (the scrub loop's
 * callback) straight onto refs — no scroll value ever enters React state, so scrubbing costs zero
 * re-renders. The single exception is `revealed`, which flips at most twice per pass.
 */
export function BurgerStage({ onSelect }: { onSelect: (burger: Burger) => void }) {
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);
  const cueRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  const handleProgress = useCallback((progress: number) => {
    if (cueRef.current) cueRef.current.style.opacity = cueOpacity(progress).toFixed(3);
    // Deepen the bottom scrim as the case is reached so the tag text stays readable.
    if (scrimRef.current) {
      scrimRef.current.style.opacity = (0.3 + smoothstep(0.5, 0.88, progress) * 0.65).toFixed(3);
    }

    const next = nextRevealed(revealedRef.current, progress);
    if (next !== revealedRef.current) {
      revealedRef.current = next;
      setRevealed(next);
    }
  }, []);

  const { videoRef } = useScrollScrub(handleProgress);

  return (
    <section id={RUNWAY_ID} className="relative h-[400vh]">
      <div
        id={STAGE_ID}
        data-reveal={revealed ? 'on' : 'off'}
        className="sticky top-0 h-screen w-full overflow-hidden bg-ink-950"
      >
        {/* Scrubbed, never played: no autoplay, no loop, no controls. */}
        <video
          ref={videoRef}
          src={STAGE_VIDEO_SRC}
          poster={STAGE_POSTER_SRC}
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Base grade: keeps the chrome readable and gives the footage a cinematic edge. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/10 to-ink-950/75" />
        {/* Scroll-linked scrim under the display case. */}
        <div
          ref={scrimRef}
          style={{ opacity: 0.3 }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950 via-ink-950/65 to-transparent"
        />

        <HotspotOverlay onSelect={onSelect} />
        <ScrollCue containerRef={cueRef} />
      </div>
    </section>
  );
}

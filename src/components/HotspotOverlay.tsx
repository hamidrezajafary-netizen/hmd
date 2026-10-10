import { useEffect, useRef, useState } from 'react';
import { HotspotCard } from '@/components/HotspotCard';
import { STAGE_VIDEO_SIZE } from '@/data/media';
import { MENU, type Burger } from '@/data/menu';
import { STAGE_ID } from '@/lib/scrub';

/**
 * Smallest stage aspect ratio (width / height) at which every anchor is still inside the frame.
 *
 * `object-fit: cover` shows only `stageAspect / videoAspect` of a height-limited frame, so at the
 * clip's 1.8 a portrait tablet (0.74) crops more than half of the display case away — a tag pinned
 * to an outer burger would sit off-screen, which is exactly what a width-only breakpoint did. Below
 * this threshold the tags dock into a row instead of pointing at nothing.
 */
const MIN_MAPPED_ASPECT = 1.58;

/**
 * The display-case overlay: one card per burger, in the same left-to-right order as the case.
 *
 * Above `MIN_MAPPED_ASPECT` the overlay is sized and centred to the exact box the clip occupies once
 * `object-fit: cover` has cropped it, so a card anchored at 15% of the frame always sits over the
 * burger that is 15% of the way across the footage — on any window shape.
 */
export function HotspotOverlay({ onSelect }: { onSelect: (burger: Burger) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [mapped, setMapped] = useState(true);

  useEffect(() => {
    const stage = document.getElementById(STAGE_ID);
    const box = boxRef.current;
    if (!stage || !box) return;

    /** Mirror `object-fit: cover` for the current stage size, and decide which layout fits. */
    const fit = () => {
      const { width, height } = stage.getBoundingClientRect();
      if (!width || !height) return;

      const scale = Math.max(width / STAGE_VIDEO_SIZE.width, height / STAGE_VIDEO_SIZE.height);
      const renderedWidth = STAGE_VIDEO_SIZE.width * scale;
      const renderedHeight = STAGE_VIDEO_SIZE.height * scale;
      box.style.width = `${renderedWidth}px`;
      box.style.height = `${renderedHeight}px`;
      box.style.left = `${(width - renderedWidth) / 2}px`;
      box.style.top = `${(height - renderedHeight) / 2}px`;

      setMapped(width / height >= MIN_MAPPED_ASPECT);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    window.addEventListener('resize', fit, { passive: true });
    window.addEventListener('orientationchange', fit, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fit);
      window.removeEventListener('orientationchange', fit);
    };
  }, []);

  return (
    <>
      {/* Pinned to each burger's own spot in the frame. Kept mounted so its box stays measured. */}
      <div ref={boxRef} className={`absolute z-20 ${mapped ? 'block' : 'hidden'}`}>
        {MENU.map((burger, index) => (
          <HotspotCard
            key={burger.id}
            burger={burger}
            index={index}
            onSelect={onSelect}
            variant="mapped"
          />
        ))}
      </div>

      {/* Dock: the same four tags in case order, for viewports that crop the case too hard. */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 px-3 pb-5 ${mapped ? 'hidden' : 'block'}`}
      >
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {MENU.map((burger, index) => (
            <HotspotCard
              key={burger.id}
              burger={burger}
              index={index}
              onSelect={onSelect}
              variant="grid"
            />
          ))}
        </div>
      </div>
    </>
  );
}

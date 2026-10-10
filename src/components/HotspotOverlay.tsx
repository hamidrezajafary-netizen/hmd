import { useEffect, useRef } from 'react';
import { HotspotCard } from '@/components/HotspotCard';
import { STAGE_VIDEO_SIZE } from '@/data/media';
import { MENU, type Burger } from '@/data/menu';
import { STAGE_ID } from '@/lib/scrub';

/**
 * The display-case overlay: one card per burger, in the same left-to-right order as the case.
 *
 * Above `md`, the overlay is sized and centred to the exact box the clip occupies once
 * `object-fit: cover` has cropped it, so a card anchored at 15% of the frame always sits over the
 * burger that is 15% of the way across the footage — on any window shape. Below `md` the crop
 * pushes the outer burgers out of view entirely, so the tags dock into a grid at the bottom
 * instead of pointing at nothing.
 */
export function HotspotOverlay({ onSelect }: { onSelect: (burger: Burger) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = document.getElementById(STAGE_ID);
    const box = boxRef.current;
    if (!stage || !box) return;

    /** Mirror `object-fit: cover` for the current stage size. */
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
      <div ref={boxRef} className="absolute z-20 hidden md:block">
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

      <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-5 md:hidden">
        <div className="grid grid-cols-2 gap-2.5">
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

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Property } from '@/data/properties';
import { cx } from '@/lib/cx';
import { PropertyCard } from '@/components/property/PropertyCard';

type PropertyCarouselProps = {
  properties: Property[];
  className?: string;
};

/**
 * Snap-scrolling rail with pointer dragging, arrow controls, keyboard support and
 * wrap-around at either end. Native touch scrolling handles swipe on phones.
 */
export function PropertyCarousel({ properties, className }: PropertyCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [dragging, setDragging] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const node = scroller.current;
    if (!node) return;
    setEdges({
      start: node.scrollLeft <= 8,
      end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const step = useCallback((direction: 1 | -1) => {
    const node = scroller.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>('[data-card]');
    const amount = card ? card.offsetWidth + 24 : node.clientWidth * 0.8;

    if (direction === 1 && node.scrollLeft + node.clientWidth >= node.scrollWidth - 8) {
      node.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    if (direction === -1 && node.scrollLeft <= 8) {
      node.scrollTo({ left: node.scrollWidth, behavior: 'smooth' });
      return;
    }
    node.scrollBy({ left: amount * direction, behavior: 'smooth' });
  }, []);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return;
    const node = scroller.current;
    if (!node) return;
    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: node.scrollLeft,
      moved: false,
    };
    setDragging(true);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = scroller.current;
    if (!node || !drag.current.active) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > 6) drag.current.moved = true;
    node.scrollLeft = drag.current.startScroll - delta;
  }

  function endDrag() {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
  }

  const arrows = (
    <>
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="Previous properties"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 bg-white text-navy shadow-soft transition-all duration-300 ease-premium hover:-translate-x-0.5 hover:border-navy hover:bg-navy hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Next properties"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 bg-white text-navy shadow-soft transition-all duration-300 ease-premium hover:translate-x-0.5 hover:border-navy hover:bg-navy hover:text-white"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </>
  );

  return (
    <div className={cx('relative', className)}>
      {/* Floating controls on tablet and up */}
      <div className="pointer-events-none absolute -left-4 top-[42%] z-20 hidden -translate-y-1/2 gap-3 md:flex lg:-left-6">
        <div className="pointer-events-auto flex gap-3">{arrows}</div>
      </div>
      <div className="pointer-events-none absolute -right-4 top-[42%] z-20 hidden -translate-y-1/2 md:block lg:-right-6">
        <div className="pointer-events-auto">{arrows}</div>
      </div>

      <div
        ref={scroller}
        role="group"
        aria-label="Featured properties"
        tabIndex={0}
        onScroll={measure}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            step(1);
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            step(-1);
          }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(event) => {
          if (drag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className={cx(
          'no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-2',
          dragging && 'drag-scroll drag-cursor',
        )}
      >
        {properties.map((property, index) => (
          <div
            key={property.id}
            data-card
            className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[23.4%]"
          >
            <PropertyCard property={property} priority={index < 3} />
          </div>
        ))}
      </div>

      {/* Controls sit under the rail on phones */}
      <div className="mt-7 flex items-center justify-between md:hidden">
        <span className="text-[12px] text-muted">Swipe or use the arrows</span>
        <div className="flex gap-3">{arrows}</div>
      </div>

      <span className="sr-only">
        {edges.start ? 'At the first property. ' : ''}
        {edges.end ? 'At the last property.' : ''}
      </span>
    </div>
  );
}

import { forwardRef } from 'react';

/**
 * The "Scroll to explore ingredients" cue. It only lives at the top of the experience —
 * the hero fades it out through a ref as soon as the visitor starts scrubbing.
 */
const ScrollCue = forwardRef<HTMLDivElement>(function ScrollCue(_props, ref) {
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-[13.5rem] z-10 flex justify-center sm:bottom-[10rem] lg:bottom-24"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-white/45 bg-ink/25 p-1.5 backdrop-blur-sm">
          <span className="animate-cue-dot h-1.5 w-1.5 rounded-full bg-bun-400" />
        </span>
        <span className="text-shadow-strong text-[10px] font-bold uppercase tracking-[0.3em] text-cream/85">
          Scroll to explore ingredients
        </span>
      </div>
    </div>
  );
});

export default ScrollCue;

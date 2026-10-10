/**
 * The opening prompt. Its opacity is written straight from the scrub loop (never React state),
 * so it tracks the scroll without a re-render and is fully gone a fraction of the way in.
 */
export function ScrollCue({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div
      ref={containerRef}
      id="scroll-cue"
      className="pointer-events-none absolute inset-x-0 bottom-[7vh] z-30 flex flex-col items-center gap-4"
    >
      <span className="px-6 text-center font-sans text-[10px] uppercase tracking-[0.45em] text-cream/80 [text-shadow:0_2px_12px_rgba(0,0,0,0.75)] sm:text-[11px]">
        Scroll down to enter
      </span>
      <span className="relative block h-16 w-px bg-gradient-to-b from-transparent via-cream/35 to-transparent">
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_14px_rgba(255,199,44,0.9)] animate-cue-dot" />
      </span>
    </div>
  );
}

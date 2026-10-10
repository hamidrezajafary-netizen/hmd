/** Confirmation pill shown after a burger is added. Remounted (new key) per message so it re-pops. */
export function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex justify-center px-4">
      <div className="animate-pop-in rounded-full border border-gold/35 bg-ink-900/85 px-5 py-2.5 text-center font-display text-[12px] tracking-[0.1em] text-cream shadow-glass backdrop-blur-xl">
        {message}
      </div>
    </div>
  );
}

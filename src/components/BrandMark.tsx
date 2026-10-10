/** The brand mark: a flame-gradient emblem with a stacked burger inside it, plus the wordmark. */
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 48 48" className="h-9 w-9 shrink-0 drop-shadow-[0_6px_16px_rgba(214,35,0,0.55)]" aria-hidden="true">
        <defs>
          <linearGradient id="bk-flame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF8732" />
            <stop offset="55%" stopColor="#D62300" />
            <stop offset="100%" stopColor="#FFC72C" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="14" fill="url(#bk-flame)" />
        {/* top bun */}
        <path d="M11 21c0-6.4 5.8-10.6 13-10.6S37 14.6 37 21z" fill="#FFF6EA" />
        <circle cx="19" cy="16.4" r="1.3" fill="#D62300" opacity="0.75" />
        <circle cx="24" cy="15" r="1.3" fill="#D62300" opacity="0.75" />
        <circle cx="29" cy="16.4" r="1.3" fill="#D62300" opacity="0.75" />
        {/* patty + cheese */}
        <rect x="11" y="23.4" width="26" height="3.6" rx="1.8" fill="#8A4520" />
        <rect x="11" y="28.2" width="26" height="2.6" rx="1.3" fill="#FFC72C" />
        {/* bottom bun */}
        <path d="M11 32.4h26c0 4.6-3.6 7.2-6.6 7.2H17.6c-3 0-6.6-2.6-6.6-7.2z" fill="#F1E3CE" />
      </svg>
      <span className="font-display text-[15px] leading-none tracking-[0.14em] text-cream sm:text-base">
        BURGER<span className="text-gold">KING</span>
      </span>
    </span>
  );
}

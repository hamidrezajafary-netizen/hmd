import type { CSSProperties } from 'react';
import { formatPrice, type Burger } from '@/data/menu';

type HotspotCardProps = {
  burger: Burger;
  /** Stagger index — written to `--i`, which CSS turns into the reveal delay. */
  index: number;
  onSelect: (burger: Burger) => void;
  /**
   * `mapped` pins the card to the burger's own spot in the frame (with a pointer rising to it).
   * `grid` is the small-screen layout, where the clip is so heavily cropped that per-burger
   * anchoring stops meaning anything.
   */
  variant?: 'mapped' | 'grid';
};

/**
 * One glassmorphism shelf tag. The whole card is a button: hovering lifts and glows it, clicking
 * opens the order dialog. `data-reveal='on'` on the stage is what fades the row in.
 */
export function HotspotCard({ burger, index, onSelect, variant = 'mapped' }: HotspotCardProps) {
  const mapped = variant === 'mapped';

  const card = (
    <div
      className="hotspot flex flex-col items-center"
      style={{ '--i': index } as CSSProperties}
    >
      {mapped && (
        <span className="flex flex-col items-center" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_12px_rgba(255,199,44,0.9)]" />
          <span className="h-9 w-px bg-gradient-to-b from-gold/70 to-transparent" />
        </span>
      )}

      <button
        type="button"
        onClick={() => onSelect(burger)}
        aria-label={`${burger.name}, ${formatPrice(burger.price)}. Open details and add to your order.`}
        className={[
          'glass-tag focus-ring group text-left transition-all duration-300 ease-premium',
          'hover:scale-[1.045] hover:border-gold/50 hover:shadow-hotspot active:scale-[0.99]',
          mapped ? 'w-[196px] px-4 py-3.5 xl:w-[214px]' : 'w-full px-3.5 py-3',
        ].join(' ')}
      >
        <span className="flex items-center gap-3">
          <span className="font-display text-[10px] tracking-[0.3em] text-gold/85">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
        </span>

        <span
          className={[
            'mt-2 block font-display leading-tight text-cream',
            mapped ? 'text-[15px] xl:text-base' : 'text-[13.5px]',
          ].join(' ')}
        >
          {burger.name}
        </span>

        <span className="mt-1.5 flex items-baseline gap-2">
          <span className={`font-display text-gold ${mapped ? 'text-lg xl:text-xl' : 'text-base'}`}>
            {formatPrice(burger.price)}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-cream/45 transition-colors duration-300 group-hover:text-cream/85">
            Add
          </span>
        </span>
      </button>
    </div>
  );

  if (!mapped) return card;

  return (
    <div
      className="absolute -translate-x-1/2"
      style={{ left: `${burger.anchor.x}%`, top: `${burger.anchor.y}%` }}
    >
      {card}
    </div>
  );
}

import { ShoppingCart } from 'lucide-react';
import { BrandMark } from './BrandMark';

type HeaderProps = {
  cartCount: number;
  onOpenCart: () => void;
};

/** Fixed, minimal chrome: brand on the left, the order basket on the right. */
export function Header({ cartCount, onOpenCart }: HeaderProps) {
  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Scrim so the chrome stays legible over the brightest frames of the clip. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink-950/85 via-ink-950/45 to-transparent" />

      <div className="relative mx-auto flex max-w-shell items-center justify-between px-4 py-4 sm:px-8 sm:py-5">
        <button
          type="button"
          onClick={backToTop}
          aria-label="Burger King — back to the top"
          className="focus-ring rounded-2xl"
        >
          <BrandMark />
        </button>

        <button
          type="button"
          onClick={onOpenCart}
          aria-label={`Open your order — ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
          className="focus-ring group flex items-center gap-2.5 rounded-full border border-white/15 bg-ink-900/55 px-3.5 py-2.5 backdrop-blur-xl transition-colors duration-300 hover:border-gold/45 hover:bg-ink-900/75 sm:px-4"
        >
          <ShoppingCart className="h-4 w-4 text-gold transition-transform duration-300 group-hover:-translate-y-0.5" />
          <span className="font-display text-[12px] tracking-[0.12em] text-cream sm:text-[13px]">
            Cart ({/* keyed so the count animates each time it changes */}
            <span key={cartCount} className="inline-block animate-pop-in">
              {cartCount}
            </span>
            )
          </span>
        </button>
      </div>
    </header>
  );
}

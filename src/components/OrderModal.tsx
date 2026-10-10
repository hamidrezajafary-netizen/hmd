import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { formatPrice, type Burger } from '@/data/menu';

type OrderModalProps = {
  /** The burger being configured, or `null` when the dialog is closed. */
  burger: Burger | null;
  onClose: () => void;
  onAdd: (burger: Burger, quantity: number) => void;
};

/** Centred order dialog over a blurred stage. */
export function OrderModal({ burger, onClose, onAdd }: OrderModalProps) {
  const [quantity, setQuantity] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = burger !== null;

  // A fresh portion count for every burger, and focus inside the dialog so Escape and Tab work.
  useEffect(() => {
    if (!open) return;
    setQuantity(1);
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previous?.focus?.();
  }, [open, burger?.id]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!burger) return null;

  const total = burger.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      {/* Backdrop: 10px blur, per spec. Clicking it dismisses. */}
      <div
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-[10px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-dialog-title"
        className="relative w-full max-w-md animate-sheet-in overflow-hidden rounded-t-3xl border border-white/12 bg-ink-900/85 shadow-sheet backdrop-blur-2xl sm:rounded-3xl"
      >
        <div className="pointer-events-none absolute -top-28 left-1/2 h-52 w-[135%] -translate-x-1/2 rounded-full bg-gradient-to-r from-ember/45 via-flame/30 to-gold/25 blur-3xl" />

        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.35em] text-gold/85">
                Flame-grilled
              </p>
              <h2
                id="order-dialog-title"
                className="mt-2 font-display text-2xl leading-tight text-cream sm:text-[28px]"
              >
                {burger.name}
              </h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="focus-ring -mr-1 -mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-cream/80 transition-colors duration-200 hover:bg-white/15 hover:text-cream"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-cream/70">{burger.description}</p>

          <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.28em] text-cream/55">Quantity</span>
            <div className="flex items-center gap-1 rounded-2xl border border-white/12 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="focus-ring grid h-9 w-9 place-items-center rounded-xl text-cream/85 transition-colors duration-200 hover:bg-white/10 disabled:opacity-35 disabled:hover:bg-transparent"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span
                aria-live="polite"
                className="w-9 text-center font-display text-lg text-cream"
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(20, value + 1))}
                aria-label="Increase quantity"
                className="focus-ring grid h-9 w-9 place-items-center rounded-xl text-cream/85 transition-colors duration-200 hover:bg-white/10"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-[0.28em] text-cream/55">Item price</span>
            <span className="font-display text-xl text-gold">{formatPrice(burger.price)}</span>
          </div>

          <button
            type="button"
            onClick={() => onAdd(burger, quantity)}
            className="focus-ring mt-5 w-full rounded-2xl bg-gradient-to-r from-ember to-flame px-6 py-4 font-display text-[15px] tracking-[0.06em] text-cream shadow-ember transition-all duration-300 ease-premium hover:brightness-110 hover:shadow-ember-hover active:scale-[0.99]"
          >
            Add to Order — {formatPrice(total)}
          </button>
        </div>
      </div>
    </div>
  );
}

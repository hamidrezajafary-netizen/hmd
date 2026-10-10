import { useEffect, useState } from 'react';
import { Check, Minus, Plus, Trash2, X } from 'lucide-react';
import { findBurger, formatPrice } from '@/data/menu';
import type { Cart } from '@/hooks/useCart';

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  cart: Cart;
};

/** The order basket: a right-hand drawer on wide screens, a bottom sheet on phones. */
export function CartDrawer({ open, onClose, cart }: CartDrawerProps) {
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPlaced(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const placeOrder = () => {
    cart.clear();
    setPlaced(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end md:items-stretch">
      <div
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-[10px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        aria-label="Your order"
        className="relative flex max-h-[88vh] w-full animate-sheet-in flex-col overflow-hidden rounded-t-3xl border border-white/12 bg-ink-900/90 shadow-sheet backdrop-blur-2xl md:h-full md:max-h-none md:max-w-md md:rounded-none md:rounded-l-3xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
          <div>
            <h2 className="font-display text-lg text-cream">Your order</h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-cream/50">
              {cart.count} {cart.count === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close your order"
            className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-cream/80 transition-colors duration-200 hover:bg-white/15 hover:text-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {placed ? (
          <div className="grid flex-1 place-items-center px-6 py-12 text-center">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-ember to-flame shadow-ember">
                <Check className="h-6 w-6 text-cream" />
              </div>
              <h3 className="mt-5 font-display text-xl text-cream">Order placed</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-cream/65">
                Your burgers are on the grill. This is a concept experience, so nothing was
                charged.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="focus-ring mt-6 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-display text-[13px] tracking-[0.08em] text-cream transition-colors duration-200 hover:bg-white/12"
              >
                Back to the display case
              </button>
            </div>
          </div>
        ) : cart.lines.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 py-14 text-center">
            <p className="max-w-xs text-sm leading-relaxed text-cream/60">
              Nothing here yet. Walk up to the display case and tap a burger to start your order.
            </p>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-5 sm:px-6">
              {cart.lines.map((line) => {
                const burger = findBurger(line.id);
                if (!burger) return null;
                return (
                  <li
                    key={line.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm text-cream">{burger.name}</p>
                        <p className="mt-0.5 text-[11px] text-cream/55">
                          {formatPrice(burger.price)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => cart.remove(line.id)}
                        aria-label={`Remove ${burger.name} from your order`}
                        className="focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-lg text-cream/45 transition-colors duration-200 hover:bg-white/10 hover:text-ember-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-0.5 rounded-xl border border-white/12 bg-white/5 p-0.5">
                        <button
                          type="button"
                          onClick={() => cart.setQuantity(line.id, line.quantity - 1)}
                          aria-label={`One fewer ${burger.name}`}
                          className="focus-ring grid h-8 w-8 place-items-center rounded-lg text-cream/85 transition-colors duration-200 hover:bg-white/10"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center font-display text-sm text-cream">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => cart.setQuantity(line.id, line.quantity + 1)}
                          aria-label={`One more ${burger.name}`}
                          className="focus-ring grid h-8 w-8 place-items-center rounded-lg text-cream/85 transition-colors duration-200 hover:bg-white/10"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-display text-sm text-gold">
                        {formatPrice(burger.price * line.quantity)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t border-white/10 px-5 py-5 sm:px-6">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-[0.28em] text-cream/55">
                  Subtotal
                </span>
                <span className="font-display text-xl text-gold">{formatPrice(cart.subtotal)}</span>
              </div>
              <button
                type="button"
                onClick={placeOrder}
                className="focus-ring mt-4 w-full rounded-2xl bg-gradient-to-r from-ember to-flame px-6 py-4 font-display text-[15px] tracking-[0.06em] text-cream shadow-ember transition-all duration-300 ease-premium hover:brightness-110 hover:shadow-ember-hover active:scale-[0.99]"
              >
                Place order — {formatPrice(cart.subtotal)}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

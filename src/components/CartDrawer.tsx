import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { MAX_QTY } from '@/data/site';
import { cx } from '@/lib/cx';
import { money } from '@/lib/motion';
import { useCart } from '@/store/cart';

/**
 * The order drawer behind the header cart icon: line items, quantities, subtotal, and a
 * client-side confirmation once the order is placed.
 */
export default function CartDrawer() {
  const { lines, count, subtotal, isOpen, closeCart, setQty, removeItem, clear } = useCart();
  const [placed, setPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const closeRef = useRef<HTMLButtonElement>(null);

  // While the drawer is open the page behind it must not scroll; Escape closes it.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeCart]);

  // Drop the confirmation as soon as the drawer closes, so reopening starts fresh.
  useEffect(() => {
    if (!isOpen) setPlaced(false);
  }, [isOpen]);

  const placeOrder = () => {
    setOrderNo(`K-${Math.floor(1000 + Math.random() * 8999)}`);
    setPlaced(true);
    clear();
  };

  return (
    <div
      aria-hidden={!isOpen}
      className={cx('fixed inset-0 z-50', isOpen ? 'pointer-events-auto' : 'pointer-events-none')}
    >
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close the order"
        onClick={closeCart}
        className={cx(
          'absolute inset-0 h-full w-full cursor-default bg-ink/65 backdrop-blur-sm transition-opacity duration-500 ease-premium',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className={cx(
          'glass glass-blur glass-strong absolute right-0 top-0 flex h-full w-full max-w-[430px] flex-col border-l border-white/10 transition-transform duration-500 ease-premium',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-cream">Your order</h2>
            <p className="mt-1 text-[12px] font-semibold text-cream/60">
              {count === 0 ? 'Nothing here yet' : `${count} item${count === 1 ? '' : 's'} · ${money(subtotal)}`}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label="Close the order"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-cream transition duration-200 ease-premium hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {placed ? (
            <div className="mt-6 flex flex-col items-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-lettuce/20 text-lettuce-400">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <p className="mt-4 text-[17px] font-extrabold text-cream">Order placed</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-cream/70">
                Order {orderNo} is in the kitchen — ready in about five minutes.
              </p>
              <button type="button" onClick={closeCart} className="btn-accent mt-5">
                Done
              </button>
            </div>
          ) : lines.length === 0 ? (
            <div className="mt-6 flex flex-col items-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-cream/60">
                <ShoppingBag className="h-6 w-6" />
              </span>
              <p className="mt-4 text-[15px] font-bold text-cream">Your order is empty</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-cream/65">
                Add the Signature Khoshmazeh Burger and it will show up here.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map((line) => (
                <li key={line.id} className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-bold text-cream">{line.name}</p>
                      <p className="mt-0.5 text-[11.5px] text-cream/60">{money(line.price)} each</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.id)}
                      aria-label={`Remove ${line.name}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-cream/60 transition duration-200 ease-premium hover:bg-chili/20 hover:text-chili-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-white/10 bg-white/5">
                      <button
                        type="button"
                        onClick={() => setQty(line.id, line.qty - 1)}
                        disabled={line.qty <= 1}
                        aria-label={`Decrease ${line.name}`}
                        className="grid h-9 w-9 place-items-center rounded-full text-cream/90 transition duration-200 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-[13px] font-bold tabular-nums text-cream">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.id, line.qty + 1)}
                        disabled={line.qty >= MAX_QTY}
                        aria-label={`Increase ${line.name}`}
                        className="grid h-9 w-9 place-items-center rounded-full text-cream/90 transition duration-200 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-[14px] font-extrabold tabular-nums text-bun-400">
                      {money(line.price * line.qty)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!placed && lines.length > 0 && (
          <footer className="safe-bottom border-t border-white/10 px-5 pt-4">
            <div className="flex items-center justify-between text-[13px] font-semibold text-cream/70">
              <span>Subtotal</span>
              <span className="text-[17px] font-extrabold tabular-nums text-cream">{money(subtotal)}</span>
            </div>
            <button type="button" onClick={placeOrder} className="btn-accent mt-3 w-full">
              Place order · {money(subtotal)}
            </button>
            <button
              type="button"
              onClick={clear}
              className="mt-1.5 w-full rounded-full py-2 text-[12px] font-semibold text-cream/55 transition duration-200 ease-premium hover:bg-white/5 hover:text-cream/80"
            >
              Clear order
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}

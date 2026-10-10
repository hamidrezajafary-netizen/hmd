import { useEffect, useRef, useState } from 'react';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { MAX_QTY, product } from '@/data/site';
import { cx } from '@/lib/cx';
import { money } from '@/lib/motion';
import { useCart } from '@/store/cart';

/** How long the "Added to your order" confirmation stays on the button. */
const CONFIRM_MS = 2000;

/**
 * The product + order panel. It floats over the video on desktop and docks to the bottom of the
 * screen on phones/tablets so the order button stays under the thumb while scrubbing.
 */
export default function OrderPanel() {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const confirmTimer = useRef<number>();

  useEffect(() => () => window.clearTimeout(confirmTimer.current), []);

  const changeQty = (delta: number) => setQty((current) => Math.min(MAX_QTY, Math.max(1, current + delta)));

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price }, qty);
    setAdded(true);
    window.clearTimeout(confirmTimer.current);
    confirmTimer.current = window.setTimeout(() => setAdded(false), CONFIRM_MS);
  };

  return (
    <section
      id="order"
      aria-labelledby="order-title"
      className="glass glass-blur w-full rounded-3xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:p-5 sm:pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] lg:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-bun-400">
            The Signature
          </span>
          <h1
            id="order-title"
            className="mt-1.5 text-[17px] font-extrabold leading-snug text-cream sm:text-[22px] lg:text-[25px]"
          >
            {product.name}
          </h1>
        </div>
        <div className="shrink-0 text-right">
          <span className="block text-xl font-extrabold tabular-nums text-bun-400 sm:text-2xl">
            {money(product.price)}
          </span>
          <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-cream/55">
            {qty > 1 ? `total ${money(product.price * qty)}` : 'per burger'}
          </span>
        </div>
      </div>

      <p className="mt-2 line-clamp-1 text-[12.5px] leading-relaxed text-cream/75 sm:line-clamp-2 lg:text-[13.5px]">
        {product.description}
      </p>

      <div className="mt-2.5 hidden flex-wrap gap-2 sm:flex">
        {product.chips.map((chip) => (
          <span key={chip} className="chip">
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2.5 sm:mt-4 lg:mt-6 lg:gap-3">
        <div className="flex h-11 shrink-0 items-center rounded-full border border-white/15 bg-white/10">
          <button
            type="button"
            className="qty-btn"
            onClick={() => changeQty(-1)}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="w-8 text-center text-[15px] font-extrabold tabular-nums text-cream">
            {qty}
          </span>
          <button
            type="button"
            className="qty-btn"
            onClick={() => changeQty(1)}
            disabled={qty >= MAX_QTY}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={cx('btn-accent flex-1 text-[14px] sm:text-[15px]', added && 'is-added')}
        >
          {added ? (
            <>
              <Check className="h-[18px] w-[18px]" strokeWidth={3} />
              Added to your order
            </>
          ) : (
            <>
              <ShoppingBag className="h-[18px] w-[18px]" />
              Add to Order
            </>
          )}
        </button>
      </div>

      <p className="mt-2 hidden text-[11px] font-medium text-cream/55 sm:block">{product.note}</p>
      <p aria-live="polite" className="sr-only">
        {added ? `${qty} × ${product.name} added to your order` : ''}
      </p>
    </section>
  );
}

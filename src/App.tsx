import { useCallback, useEffect, useRef, useState } from 'react';
import { BurgerStage } from '@/components/BurgerStage';
import { CartDrawer } from '@/components/CartDrawer';
import { Header } from '@/components/Header';
import { OrderModal } from '@/components/OrderModal';
import { Toast } from '@/components/Toast';
import type { Burger } from '@/data/menu';
import { useCart } from '@/hooks/useCart';
import { useScrollLock } from '@/hooks/useScrollLock';

type ToastMessage = { id: number; text: string };

export default function App() {
  const cart = useCart();
  const [selected, setSelected] = useState<Burger | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  // One lock for the whole overlay stack, so closing one and opening the other cannot fight.
  useScrollLock(selected !== null || cartOpen);

  const notify = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text });
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const handleAdd = useCallback(
    (burger: Burger, quantity: number) => {
      cart.add(burger.id, quantity);
      setSelected(null);
      notify(`${quantity} × ${burger.name} added to your order`);
    },
    [cart, notify],
  );

  return (
    <div className="relative bg-ink-900">
      <Header cartCount={cart.count} onOpenCart={() => setCartOpen(true)} />

      <main>
        <BurgerStage onSelect={setSelected} />
      </main>

      <OrderModal burger={selected} onClose={() => setSelected(null)} onAdd={handleAdd} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} />
      <Toast key={toast?.id ?? 'none'} message={toast?.text ?? null} />
    </div>
  );
}

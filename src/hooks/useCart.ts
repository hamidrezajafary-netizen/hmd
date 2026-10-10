import { useCallback, useMemo, useState } from 'react';
import { findBurger } from '@/data/menu';

export type CartLine = { id: string; quantity: number };

/** Client-side order basket: nothing is persisted, a reload starts a fresh order. */
export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) return;
    setLines((prev) => {
      const existing = prev.find((line) => line.id === id);
      if (!existing) return [...prev, { id, quantity }];
      return prev.map((line) =>
        line.id === id ? { ...line, quantity: line.quantity + quantity } : line,
      );
    });
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((line) => line.id !== id)
        : prev.map((line) => (line.id === id ? { ...line, quantity } : line)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((total, line) => total + line.quantity, 0), [lines]);

  const subtotal = useMemo(
    () =>
      lines.reduce((total, line) => {
        const burger = findBurger(line.id);
        return burger ? total + burger.price * line.quantity : total;
      }, 0),
    [lines],
  );

  return { lines, count, subtotal, add, setQuantity, remove, clear };
}

export type Cart = ReturnType<typeof useCart>;

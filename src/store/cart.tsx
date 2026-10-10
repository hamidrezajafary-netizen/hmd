import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { MAX_QTY } from '@/data/site';

export type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type CartValue = {
  lines: CartLine[];
  /** Total number of burgers in the order — drives the header badge. */
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartLine, 'qty'>, qty: number) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const clampQty = (qty: number): number => Math.min(MAX_QTY, Math.max(1, Math.round(qty)));

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((item: Omit<CartLine, 'qty'>, qty: number) => {
    setLines((current) => {
      const existing = current.find((line) => line.id === item.id);
      if (!existing) return [...current, { ...item, qty: clampQty(qty) }];
      return current.map((line) =>
        line.id === item.id ? { ...line, qty: clampQty(line.qty + qty) } : line,
      );
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, qty: clampQty(qty) } : line)),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setLines((current) => current.filter((line) => line.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((total, line) => total + line.qty, 0);
    const subtotal = lines.reduce((total, line) => total + line.qty * line.price, 0);
    return {
      lines,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      addItem,
      setQty,
      removeItem,
      clear,
    };
  }, [lines, isOpen, openCart, closeCart, addItem, setQty, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside <CartProvider>');
  return value;
}

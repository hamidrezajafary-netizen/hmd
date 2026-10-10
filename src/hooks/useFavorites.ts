import { useEffect, useState } from 'react';

const FAVORITES_KEY = 'horizon:favorites';
const FAVORITES_EVENT = 'horizon:favorites-changed';

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable (private mode) — favourites simply stay in memory */
  }
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
}

/** Saved properties, persisted per visitor and kept in sync across components. */
export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read());
    const sync = () => setIds(read());
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isFavorite = (id: string) => ids.includes(id);

  const toggle = (id: string) => {
    const next = read().includes(id) ? read().filter((item) => item !== id) : [...read(), id];
    write(next);
    setIds(next);
  };

  return { favorites: ids, isFavorite, toggle };
}

import { useEffect, useState } from 'react';
import { Menu as MenuIcon, ShoppingBag, X } from 'lucide-react';
import { brand, chapters } from '@/data/site';
import { cx } from '@/lib/cx';
import { scrollToProgress } from '@/lib/scrub';
import { useCart } from '@/store/cart';

export default function Header() {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (at: number) => {
    setMenuOpen(false);
    scrollToProgress(at);
  };

  return (
    <header className="animate-fade fixed inset-x-0 top-0 z-40">
      <div className="glass-blur border-b border-white/10 bg-ink/45">
        <div className="shell flex h-16 items-center justify-between gap-3 lg:h-[76px]">
          {/* Logo */}
          <button
            type="button"
            onClick={() => go(0)}
            className="flex items-center gap-2.5 rounded-2xl py-1 pr-2 transition-colors duration-300 ease-premium hover:bg-white/5"
            aria-label={`${brand.name} — back to the top`}
          >
            <span className="font-persian grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-bun-400 to-bun-600 text-lg font-bold text-ink shadow-[0_10px_26px_-12px_rgba(245,165,36,0.85)]">
              {brand.script}
            </span>
            <span className="text-left leading-none">
              <span className="block text-[17px] font-extrabold tracking-tight text-cream">
                {brand.name}
              </span>
              <span className="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.28em] text-cream/55 sm:block">
                {brand.tagline}
              </span>
            </span>
          </button>

          {/* Navigation */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Sections">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => go(chapter.at)}
                className="nav-link"
              >
                {chapter.label}
              </button>
            ))}
          </nav>

          {/* Cart + mobile menu */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCart}
              aria-label={count === 0 ? 'Your order is empty' : `Your order, ${count} item${count === 1 ? '' : 's'}`}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-cream transition duration-300 ease-premium hover:border-white/25 hover:bg-white/20"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-chili px-1 text-[11px] font-extrabold text-white shadow-badge ring-2 ring-ink/70">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Close the menu' : 'Open the menu'}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-cream transition duration-300 ease-premium hover:border-white/25 hover:bg-white/20 md:hidden"
            >
              {menuOpen ? <X className="h-[18px] w-[18px]" /> : <MenuIcon className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Sections"
          className="glass glass-blur animate-menu mx-3 mt-2 rounded-2xl p-2 md:hidden"
        >
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => go(chapter.at)}
              className={cx(
                'block w-full rounded-xl px-4 py-3 text-left text-[15px] font-bold text-cream/90',
                'transition duration-200 ease-premium hover:bg-white/10 hover:text-cream',
              )}
            >
              {chapter.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

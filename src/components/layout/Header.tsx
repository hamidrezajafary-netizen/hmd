import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Phone, X } from 'lucide-react';
import { navItems, site } from '@/data/site';
import { cx } from '@/lib/cx';
import { Logo } from '@/components/ui/Logo';

export function Header() {
  const { pathname } = useLocation();
  const overHero = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const solid = !overHero || scrolled;

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-premium',
        solid
          ? 'bg-navy/95 shadow-[0_16px_45px_-30px_rgba(6,18,35,0.95)] backdrop-blur-md'
          : 'bg-gradient-to-b from-navy-950/75 via-navy-950/25 to-transparent',
      )}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="group/nav relative block py-2">
              {({ isActive }) => (
                <>
                  <span
                    className={cx(
                      'text-[13px] font-medium transition-colors duration-300',
                      isActive ? 'text-white' : 'text-white/75 hover:text-white',
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cx(
                      'absolute bottom-0 left-0 h-px bg-champagne transition-all duration-300 ease-premium',
                      isActive ? 'w-full' : 'w-0 group-hover/nav:w-full',
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={site.phoneHref}
            className="hidden h-10 items-center gap-2 rounded-lg border border-white/30 px-4 text-[13px] font-medium text-white transition-all duration-300 ease-premium hover:border-white hover:bg-white/10 md:inline-flex"
          >
            <Phone className="h-3.5 w-3.5 text-champagne" aria-hidden="true" />
            {site.phone}
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 text-white transition hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="animate-menu-in border-t border-white/10 bg-navy lg:hidden"
        >
          <nav aria-label="Mobile" className="shell flex flex-col py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cx(
                    'flex items-center justify-between border-b border-white/5 py-3.5 text-[15px] font-medium transition-colors',
                    isActive ? 'text-champagne' : 'text-white/85 hover:text-white',
                  )
                }
              >
                {item.label}
                <span aria-hidden="true" className="text-champagne/70">
                  ↗
                </span>
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-navy"
            >
              <Phone className="h-4 w-4 text-champagne" aria-hidden="true" />
              {site.phone}
            </Link>
            <p className="mt-4 pb-2 text-center text-[12px] text-white/50">{site.hours}</p>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

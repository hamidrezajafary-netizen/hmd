import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '@/lib/cx';

type Crumb = { label: string; to?: string };

type PageHeroProps = {
  label: string;
  title: string;
  intro?: ReactNode;
  crumbs?: Crumb[];
};

/** Compact navy band used at the top of every inner page (clears the fixed header). */
export function PageHero({ label, title, intro, crumbs }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy pb-14 pt-[116px] text-white sm:pb-16 sm:pt-[132px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-champagne/10 blur-3xl"
      />
      <div className="shell relative">
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[12px] text-white/50">
            {crumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {crumb.to ? (
                  <Link to={crumb.to} className="transition-colors hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={cx(index === crumbs.length - 1 && 'text-white/80')}>
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <p className="eyebrow">{label}</p>
        <h1 className="mt-4 max-w-3xl text-[1.9rem] leading-[1.1] sm:text-4xl lg:text-[2.9rem]">
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 max-w-2xl text-[14.5px] leading-[1.85] text-white/65">{intro}</p>
        ) : null}
      </div>
    </section>
  );
}

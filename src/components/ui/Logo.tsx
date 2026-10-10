import { Link } from 'react-router-dom';
import { cx } from '@/lib/cx';

/** The Horizon mark: a minimal architectural roof line in champagne. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cx('h-8 w-8', className)} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 21.5 16 7.5l11 14" />
        <path d="M10.5 21.5h11" />
        <path d="M7.5 25.5h17" />
      </g>
    </svg>
  );
}

type LogoProps = {
  className?: string;
  tone?: 'light' | 'dark';
  compact?: boolean;
};

export function Logo({ className, tone = 'light', compact = false }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label="Horizon Properties — home"
      className={cx('group inline-flex items-center gap-2.5', className)}
    >
      <LogoMark className="h-[30px] w-[30px] text-champagne transition-transform duration-500 ease-premium group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none">
        <span
          className={cx(
            'text-[15px] font-extrabold uppercase tracking-[0.16em]',
            tone === 'light' ? 'text-white' : 'text-navy',
          )}
        >
          Horizon
        </span>
        {!compact ? (
          <span
            className={cx(
              'mt-1 text-[9px] font-semibold uppercase tracking-[0.42em]',
              tone === 'light' ? 'text-white/65' : 'text-muted',
            )}
          >
            Properties
          </span>
        ) : null}
      </span>
    </Link>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '@/lib/cx';

type Variant = 'navy' | 'champagne' | 'outline' | 'outlineLight' | 'quiet';
type Size = 'sm' | 'md' | 'lg';

type BaseProps = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type ButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: string;
    href?: string;
  };

const variants: Record<Variant, string> = {
  navy: 'bg-navy text-white hover:bg-navy-800 shadow-soft',
  champagne: 'bg-champagne text-navy-900 hover:bg-champagne-400',
  outline: 'border border-navy/15 text-navy hover:border-navy hover:bg-navy hover:text-white',
  outlineLight: 'border border-white/35 text-white hover:border-white hover:bg-white/10',
  quiet: 'text-navy hover:text-champagne',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-[13px]',
  md: 'h-11 px-5 text-[13.5px]',
  lg: 'h-12 px-6 text-sm',
};

export function Button({
  variant = 'navy',
  size = 'md',
  icon,
  className,
  children,
  to,
  href,
  ...rest
}: ButtonProps) {
  const classes = cx(
    'group/btn inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-[0.01em] transition-all duration-300 ease-premium disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  );

  const content = (
    <>
      {children}
      {icon ? (
        <span className="transition-transform duration-300 ease-premium group-hover/btn:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}

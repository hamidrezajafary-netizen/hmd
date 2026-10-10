import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Reveal } from '@/components/ui/Reveal';

type SectionHeadingProps = {
  label?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  children?: ReactNode;
};

export function SectionHeading({
  label,
  title,
  intro,
  align = 'left',
  className,
  children,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <Reveal className={cx(centered && 'flex flex-col items-center text-center', className)}>
      {label ? <p className="eyebrow">{label}</p> : null}
      <h2 className={cx('section-title', label ? 'mt-4' : '')}>{title}</h2>
      {centered ? <span className="mt-6 rule-gold" aria-hidden="true" /> : null}
      {intro ? (
        <p className={cx('lede mt-5', centered ? 'max-w-2xl' : 'max-w-xl')}>{intro}</p>
      ) : null}
      {children}
    </Reveal>
  );
}

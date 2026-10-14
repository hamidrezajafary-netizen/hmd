import { useMemo } from 'react';
import { buildCardSvg, type Side } from './svg';
import type { CardSpec, MockupBg } from './spec';

export const BACKGROUNDS: Record<MockupBg, { label: string; css: string }> = {
  desk: {
    label: 'Walnut desk',
    css: 'radial-gradient(120% 90% at 30% 20%, #6b4a33 0%, #3d281b 55%, #22150e 100%)',
  },
  slate: {
    label: 'Slate',
    css: 'radial-gradient(120% 90% at 30% 20%, #3a4252 0%, #232936 60%, #141822 100%)',
  },
  paper: {
    label: 'Light stone',
    css: 'radial-gradient(120% 90% at 30% 20%, #f4f1ea 0%, #e2ddd2 60%, #cfc8ba 100%)',
  },
};

type Props = {
  spec: CardSpec;
  side: Side;
  mode: 'mockup' | 'print';
  bg: MockupBg;
};

/** Live preview: a flipping, shadowed card on a surface — or the flat print artboard with guides. */
export function CardMockup({ spec, side, mode, bg }: Props) {
  const svgs = useMemo(
    () => ({
      front: buildCardSvg('front', spec, { bleed: mode === 'print', guides: mode === 'print' }),
      back: buildCardSvg('back', spec, { bleed: mode === 'print', guides: mode === 'print' }),
    }),
    [spec, mode],
  );

  if (mode === 'print') {
    return (
      <div className="flex min-h-[22rem] w-full self-start lg:sticky lg:top-6 flex-col items-center justify-center gap-4 rounded-3xl bg-[#0E1630] p-6 ring-1 ring-white/10 sm:p-10">
        <div className="w-full max-w-[34rem] bg-white shadow-2xl" dangerouslySetInnerHTML={{ __html: svgs[side] }} />
        <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-slate-300">
          <span className="inline-flex items-center gap-2">
            <i className="inline-block h-0 w-5 border-t-2 border-dashed border-[#FF3B6B]" /> Trim 85 × 55 mm
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="inline-block h-0 w-5 border-t-2 border-dashed border-[#16D9C0]" /> Safe area (4 mm in)
          </span>
          <span>Bleed 3 mm → 91 × 61 mm artboard</span>
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[22rem] w-full self-start lg:sticky lg:top-6 items-center justify-center rounded-3xl p-6 ring-1 ring-white/10 sm:p-12"
      style={{ background: BACKGROUNDS[bg].css }}
    >
      <div
        className="w-full max-w-[32rem]"
        style={{
          perspective: '1600px',
          // The shadow lives on this outer wrapper: a filter on the 3D element would flatten it and
          // make the back face show through as a mirrored front.
          filter: 'drop-shadow(0 28px 22px rgba(0,0,0,.45)) drop-shadow(0 4px 4px rgba(0,0,0,.35))',
        }}
      >
        <div
          className="relative w-full transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{
            aspectRatio: `${85} / ${55}`,
            transformStyle: 'preserve-3d',
            transform: `rotateX(6deg) rotateZ(-1.5deg) rotateY(${side === 'back' ? 180 : 0}deg)`,
          }}
        >
          {(['front', 'back'] as const).map((s) => (
            <div
              key={s}
              aria-hidden={s !== side}
              className="absolute inset-0 overflow-hidden rounded-[3px]"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: s === 'back' ? 'rotateY(180deg)' : undefined,
              }}
              dangerouslySetInnerHTML={{ __html: svgs[s] }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

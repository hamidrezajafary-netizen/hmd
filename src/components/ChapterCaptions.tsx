import type { MutableRefObject } from 'react';
import { chapters } from '@/data/site';

type Props = {
  /** One ref per chapter, in `chapters` order — the hero writes opacity/transform into them. */
  refs: MutableRefObject<(HTMLDivElement | null)[]>;
};

/**
 * The floating captions that narrate the burger as its layers come apart. They sit in the same
 * spot as the scroll cue, so one crossfades into the next. Kept as plain DOM nodes whose
 * opacity is written straight from the scrub loop — scrolling re-renders nothing.
 */
export default function ChapterCaptions({ refs }: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[13.5rem] flex justify-center px-4 sm:bottom-[10rem] sm:px-6 lg:bottom-24">
      <div className="relative w-full max-w-xl">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            ref={(element) => {
              refs.current[index] = element;
            }}
            aria-hidden={index !== 0}
            className="glass glass-blur absolute inset-x-0 bottom-0 rounded-2xl px-5 py-4 text-center opacity-0"
          >
            <span className="mx-auto mb-2.5 block h-[3px] w-9 rounded-full bg-gradient-to-r from-bun-400 to-chili-400" />
            <p className="text-shadow-strong text-[17px] font-extrabold leading-snug text-cream sm:text-xl">
              {chapter.title}
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-cream/80">{chapter.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

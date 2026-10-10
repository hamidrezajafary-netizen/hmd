import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { cx } from '@/lib/cx';
import { photo } from '@/lib/images';
import { SmartImage } from '@/components/ui/SmartImage';

type GalleryProps = {
  images: string[];
  name: string;
};

export function Gallery({ images, name }: GalleryProps) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'ArrowRight') setActive((index) => (index + 1) % images.length);
      if (event.key === 'ArrowLeft') setActive((index) => (index - 1 + images.length) % images.length);
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, images.length]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open full screen gallery of ${name}, photo ${active + 1} of ${images.length}`}
        className="group relative block w-full overflow-hidden rounded-xl"
      >
        <SmartImage
          id={images[active]}
          alt={`${name} — photo ${active + 1}`}
          className="aspect-[16/11] w-full"
          imgClassName="transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 62vw, 100vw"
          widths={[720, 1200, 1600, 2000]}
          priority
        />
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-navy/80 px-3.5 py-2 text-[12px] font-semibold text-white backdrop-blur transition-colors group-hover:bg-navy">
          <Expand className="h-3.5 w-3.5 text-champagne" aria-hidden="true" />
          View all {images.length} photos
        </span>
      </button>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show photo ${index + 1}`}
            aria-current={index === active}
            className={cx(
              'overflow-hidden rounded-lg transition-all duration-300 ease-premium',
              index === active
                ? 'ring-2 ring-champagne ring-offset-2 ring-offset-white'
                : 'opacity-70 hover:opacity-100',
            )}
          >
            <SmartImage
              id={image}
              alt={`${name} thumbnail ${index + 1}`}
              className="aspect-[4/3]"
              sizes="(min-width: 1024px) 15vw, 24vw"
              widths={[320, 480]}
            />
          </button>
        ))}
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} gallery`}
          className="animate-fade-in fixed inset-0 z-[100] flex flex-col bg-navy-950/96 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-5 py-4 text-white sm:px-8">
            <p className="text-[12px] uppercase tracking-[0.24em] text-white/60">
              {name} · {active + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close gallery"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16">
            <button
              type="button"
              onClick={() => setActive((index) => (index - 1 + images.length) % images.length)}
              aria-label="Previous photo"
              className="absolute left-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <img
              key={images[active]}
              src={photo(images[active], 1920)}
              alt={`${name} — photo ${active + 1}`}
              className="animate-fade-in max-h-[66vh] w-auto max-w-full rounded-lg object-contain sm:max-h-[72vh]"
            />

            <button
              type="button"
              onClick={() => setActive((index) => (index + 1) % images.length)}
              aria-label="Next photo"
              className="absolute right-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex justify-center gap-3 px-5 pb-8">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === active}
                className={cx(
                  'h-1.5 w-10 rounded-full transition-all duration-300',
                  index === active ? 'bg-champagne' : 'bg-white/25 hover:bg-white/50',
                )}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

import { ArrowRight, Phone } from 'lucide-react';
import { site } from '@/data/site';
import { photo, photoSet } from '@/lib/images';
import { Button } from '@/components/ui/Button';

const HERO_IMAGE = '1748063578185-3d68121b11ff';

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[88svh] flex-col justify-start overflow-hidden bg-navy-950 pb-16 pt-[124px] sm:min-h-[92svh] sm:pt-[148px] lg:min-h-[94svh] lg:pb-20">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={photo(HERO_IMAGE, 1920)}
          srcSet={photoSet(HERO_IMAGE, [960, 1440, 1920, 2400])}
          sizes="100vw"
          alt=""
          loading="eager"
          decoding="sync"
          className="animate-hero-zoom h-full w-full scale-[1.02] object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-950/55" />
        <div className="absolute inset-0 bg-[radial-gradient(115%_75%_at_50%_8%,rgba(6,18,35,0.25)_0%,rgba(6,18,35,0.72)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/85 to-transparent" />
      </div>

      <div className="shell relative flex flex-1 flex-col items-center justify-center text-center">
        <p className="eyebrow animate-hero-fade">Private client real estate</p>

        <h1 className="animate-hero-rise mt-6 max-w-4xl text-[2.35rem] font-extrabold leading-[1.05] text-white text-shadow-hero sm:text-[3.4rem] lg:text-[4.15rem]">
          Discover Exceptional
          <br />
          Homes &amp; Investments
        </h1>

        <span
          aria-hidden="true"
          className="animate-hero-fade mt-8 h-px w-16 bg-champagne/80"
          style={{ animationDelay: '180ms' }}
        />

        <p
          className="animate-hero-rise mt-7 max-w-xl text-[15px] leading-[1.85] text-white/80 text-shadow-hero sm:text-base"
          style={{ animationDelay: '140ms' }}
        >
          Premium properties in prime locations. Find your dream home or the perfect investment with
          confidence.
        </p>

        <div
          className="animate-hero-rise mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
          style={{ animationDelay: '260ms' }}
        >
          <Button to="/properties" size="lg" variant="champagne" icon={<ArrowRight className="h-4 w-4" />} className="w-full sm:w-auto">
            Explore Properties
          </Button>
          <Button
            href={site.phoneHref}
            size="lg"
            variant="outlineLight"
            icon={<Phone className="h-4 w-4 text-champagne" />}
            className="w-full sm:w-auto"
          >
            Book a Consultation
          </Button>
        </div>
      </div>

      <div className="shell relative mt-14 hidden justify-center sm:flex">
        <a
          href="#who-we-are"
          className="group inline-flex flex-col items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-white/50 transition-colors hover:text-white/80"
        >
          Scroll to discover
          <span className="h-10 w-px bg-gradient-to-b from-champagne/80 to-transparent transition-transform duration-500 group-hover:translate-y-1" />
        </a>
      </div>
    </section>
  );
}

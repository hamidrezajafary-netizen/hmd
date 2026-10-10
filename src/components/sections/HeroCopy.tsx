import { ArrowRight, Phone } from 'lucide-react';
import { site } from '@/data/site';
import { Button } from '@/components/ui/Button';

/**
 * The hero's words and calls to action — shared by the static hero (reduced-motion and
 * fallback) and the scroll-scrubbed video hero so the two can never drift apart.
 */
export function HeroCopy() {
  return (
    <>
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
        <Button
          to="/properties"
          size="lg"
          variant="champagne"
          icon={<ArrowRight className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
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
    </>
  );
}

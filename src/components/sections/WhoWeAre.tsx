import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SmartImage } from '@/components/ui/SmartImage';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export function WhoWeAre() {
  return (
    <section id="who-we-are" className="bg-white py-20 lg:py-28">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">About us</p>
          <h2 className="section-title mt-4">Who We Are</h2>
          <p className="lede mt-6 max-w-lg">
            At Horizon Properties, we connect people with extraordinary homes and smart investments.
            Integrity, transparency, and client satisfaction are at the heart of everything we do.
          </p>

          <dl className="mt-9 grid max-w-md grid-cols-3 gap-6 border-y border-hairline py-6">
            {[
              { value: '24', label: 'Years advising' },
              { value: '1,240', label: 'Homes placed' },
              { value: '38', label: 'Markets' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-[22px] font-extrabold tracking-[-0.02em] text-navy">{stat.value}</dd>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>

          <Button
            to="/about"
            size="lg"
            className="mt-9"
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Learn More
          </Button>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={120}>
          <div className="flex gap-4 sm:gap-5">
            <div className="group relative flex-[2.35] overflow-hidden rounded-xl2">
              <SmartImage
                id="1613977257363-707ba9348227"
                alt="Modern white villa with a swimming pool and outdoor lounge"
                className="aspect-[4/3] w-full"
                imgClassName="transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.05]"
                sizes="(min-width: 1024px) 44vw, 62vw"
                widths={[640, 960, 1440]}
              />
            </div>

            <Link
              to="/properties"
              aria-label="Browse all properties"
              className="group relative flex-1 overflow-hidden rounded-xl2 bg-navy"
            >
              <SmartImage
                id="1721815693498-cc28507c0ba2"
                alt="Contemporary two-storey house with glass balconies"
                className="h-full w-full"
                imgClassName="scale-[1.12] blur-[3px] opacity-60 transition-all duration-[1200ms] ease-premium group-hover:scale-[1.06] group-hover:opacity-80"
                sizes="(min-width: 1024px) 18vw, 26vw"
                widths={[420, 640]}
              />
              <span aria-hidden="true" className="absolute inset-0 bg-navy/45 transition-colors duration-500 group-hover:bg-navy/35" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-navy shadow-soft transition-transform duration-500 ease-premium group-hover:translate-x-1">
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </span>
              <span className="absolute inset-x-0 bottom-5 text-center text-[10.5px] font-semibold uppercase tracking-[0.24em] text-white/85">
                View all
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

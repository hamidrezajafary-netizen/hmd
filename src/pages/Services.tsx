import { Check } from 'lucide-react';
import { services } from '@/data/site';
import { PageHero } from '@/components/layout/PageHero';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { CtaSection } from '@/components/sections/CtaSection';

export function Services() {
  return (
    <>
      <PageHero
        label="Services"
        title="Six disciplines, delivered by one senior advisor"
        intro="Whether you are buying a first home, restructuring a portfolio or moving a family across the country, the work starts with the same conversation."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      />

      <section className="bg-white py-20 lg:py-24">
        <div className="shell space-y-16 lg:space-y-20">
          {services.map((service, index) => (
            <Reveal key={service.id}>
              <article
                className={`grid items-center gap-10 lg:grid-cols-12 lg:gap-14 ${
                  index % 2 === 1 ? 'lg:[&>figure]:order-2' : ''
                }`}
              >
                <figure className="group overflow-hidden rounded-xl2 lg:col-span-6">
                  <SmartImage
                    id={service.image}
                    alt={`${service.title} — illustrative property photography`}
                    className="aspect-[4/3] w-full"
                    imgClassName="transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.05]"
                    sizes="(min-width: 1024px) 46vw, 92vw"
                    widths={[640, 960, 1440]}
                  />
                </figure>

                <div className="lg:col-span-6">
                  <span className="text-[11px] font-bold tracking-[0.24em] text-champagne">
                    {service.index}
                  </span>
                  <h2 className="mt-4 text-[24px] font-bold sm:text-[28px]">{service.title}</h2>
                  <p className="mt-4 text-[14.5px] leading-[1.9] text-muted">{service.summary}</p>
                  <p className="mt-3 text-[14.5px] leading-[1.9] text-muted">{service.detail}</p>

                  <ul className="mt-7 space-y-3">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-[13.5px] text-navy/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <Button to="/contact" variant="outline" className="mt-8">
                    Discuss this service
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  );
}

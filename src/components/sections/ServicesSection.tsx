import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '@/data/site';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';

export function ServicesSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            label="Services"
            title="Advice across the whole journey"
            intro="Six disciplines, one senior advisor per client — from first viewing to long-term portfolio review."
          />
          <Reveal delay={100}>
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 text-[13px] font-semibold text-navy transition-colors hover:text-champagne"
            >
              Explore all services
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 border-t border-hairline">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 40}>
              <Link
                to="/services"
                className="group grid grid-cols-1 items-center gap-5 border-b border-hairline py-7 transition-colors duration-500 hover:bg-ivory/70 lg:grid-cols-12 lg:gap-8 lg:px-2"
              >
                <span className="text-[11px] font-bold tracking-[0.24em] text-champagne lg:col-span-1">
                  {service.index}
                </span>

                <span className="flex items-center gap-4 lg:col-span-4">
                  <SmartImage
                    id={service.image}
                    alt=""
                    className="h-14 w-16 shrink-0 rounded-lg lg:hidden"
                    sizes="80px"
                    widths={[160, 240]}
                  />
                  <span className="text-[19px] font-bold leading-snug transition-transform duration-500 ease-premium group-hover:translate-x-1 lg:text-[21px]">
                    {service.title}
                  </span>
                </span>

                <span className="text-[13.5px] leading-[1.8] text-muted lg:col-span-4">
                  {service.summary}
                </span>

                <span className="hidden lg:col-span-2 lg:block">
                  <SmartImage
                    id={service.image}
                    alt=""
                    className="h-16 w-24 rounded-lg opacity-90 transition-all duration-700 ease-premium group-hover:opacity-100 group-hover:shadow-soft"
                    imgClassName="transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.08]"
                    sizes="120px"
                    widths={[240, 360]}
                  />
                </span>

                <span className="hidden justify-end lg:col-span-1 lg:flex" aria-hidden="true">
                  <ArrowRight className="h-4 w-4 text-navy/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-champagne" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

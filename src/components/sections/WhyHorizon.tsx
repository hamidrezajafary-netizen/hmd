import { ArrowRight } from 'lucide-react';
import { whyHorizon } from '@/data/site';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export function WhyHorizon() {
  return (
    <section className="bg-navy py-20 text-white lg:py-28">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Why Horizon</p>
          <h2 className="section-title mt-4 text-white">
            A quiet advantage in competitive markets
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-[1.85] text-white/65">
            Most of what we sell is never advertised. Our clients see homes first, with the evidence
            they need to decide quickly and confidently.
          </p>
          <Button
            to="/contact"
            variant="champagne"
            size="lg"
            className="mt-9"
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Speak to an advisor
          </Button>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={120}>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl2 bg-white/10">
            {whyHorizon.stats.map((stat) => (
              <div key={stat.label} className="bg-navy p-6 sm:p-8">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-[30px] font-extrabold tracking-[-0.03em] text-champagne sm:text-[34px]">
                  {stat.value}
                </dd>
                <dd className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/55">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-10 grid gap-8 sm:grid-cols-3">
            {whyHorizon.pillars.map((pillar) => (
              <li key={pillar.title} className="border-t border-white/15 pt-5">
                <h3 className="text-[14.5px] font-bold text-white">{pillar.title}</h3>
                <p className="mt-3 text-[13px] leading-[1.75] text-white/60">{pillar.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

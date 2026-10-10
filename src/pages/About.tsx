import { ArrowRight, Compass } from 'lucide-react';
import { values, whyHorizon } from '@/data/site';
import { PageHero } from '@/components/layout/PageHero';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';
import { WhyHorizon } from '@/components/sections/WhyHorizon';
import { CtaSection } from '@/components/sections/CtaSection';

const steps = [
  {
    index: '01',
    title: 'Discovery',
    body: 'A ninety minute conversation about how you live, what you are planning and the return you expect.',
  },
  {
    index: '02',
    title: 'Search & shortlist',
    body: 'Published and off-market homes, presented with comparable evidence and a written recommendation.',
  },
  {
    index: '03',
    title: 'Negotiation & closing',
    body: 'We negotiate, coordinate survey and legal teams, and stay with you until the keys change hands.',
  },
];

export function About() {
  return (
    <>
      <PageHero
        label="About us"
        title="A private-client house built on evidence and discretion"
        intro="Horizon Properties was founded in 2001 to advise families, funds and private offices on residential property across the United States."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="shell grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow">Who we are</p>
            <h2 className="section-title mt-4">Extraordinary homes, plainly explained</h2>
            <div className="mt-6 space-y-5 text-[14.5px] leading-[1.9] text-muted">
              <p>
                At Horizon Properties, we connect people with extraordinary homes and smart investments.
                Integrity, transparency, and client satisfaction are at the heart of everything we do.
              </p>
              <p>
                We work with a deliberately small number of clients at any one time. Each engagement is
                led by one senior advisor who owns the outcome, supported by a research desk that
                prepares the valuation, yield and market-depth work behind every recommendation.
              </p>
              <p>
                Two thirds of our business comes from clients we have already advised, or the people
                they send to us. We think that is the only measure of a real estate business that
                matters.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-hairline py-7 sm:grid-cols-4">
              {[
                { value: '2001', label: 'Founded' },
                { value: '24', label: 'Years' },
                { value: '1,240', label: 'Homes placed' },
                { value: '38', label: 'Markets' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-[22px] font-extrabold tracking-[-0.02em]">{stat.value}</dd>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>

            <Button to="/contact" size="lg" className="mt-9" icon={<ArrowRight className="h-4 w-4" />}>
              Speak with an advisor
            </Button>
          </Reveal>

          <Reveal className="lg:col-span-6" delay={120}>
            <div className="flex gap-4 sm:gap-5">
              <div className="group flex-[1.9] overflow-hidden rounded-xl2">
                <SmartImage
                  id="1600596542815-ffad4c1539a9"
                  alt="Contemporary white house framed by mature planting"
                  className="aspect-[4/5] w-full"
                  imgClassName="transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.05]"
                  sizes="(min-width: 1024px) 34vw, 55vw"
                  widths={[480, 720, 960]}
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 sm:gap-5">
                <div className="group overflow-hidden rounded-xl2">
                  <SmartImage
                    id="1600585154340-be6161a56a0c"
                    alt="Interior living space opening onto a terrace"
                    className="aspect-square w-full"
                    imgClassName="transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.06]"
                    sizes="(min-width: 1024px) 18vw, 30vw"
                    widths={[420, 640]}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center rounded-xl2 border border-hairline bg-ivory p-5">
                  <Compass className="h-6 w-6 text-champagne" aria-hidden="true" />
                  <p className="mt-4 text-[13.5px] font-semibold leading-relaxed">
                    “We sell the evidence, not the headline.”
                  </p>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-muted">
                    Daniel Morgan, Managing Director
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-20 lg:py-24">
        <div className="shell">
          <SectionHeading
            align="center"
            label="Values"
            title="How we work with clients"
            intro="Three commitments we make at the start of every engagement."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 70}>
                <article className="h-full rounded-xl2 border border-hairline bg-white p-7">
                  <span className="text-[11px] font-bold tracking-[0.24em] text-champagne">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 text-[18px] font-bold">{value.title}</h3>
                  <p className="mt-3 text-[13.5px] leading-[1.85] text-muted">{value.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="shell">
          <SectionHeading
            label="Process"
            title="Three steps, one advisor"
            intro="A clear process with written checkpoints so nothing is left to assumption."
          />
          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.index} delay={index * 70}>
                <li className="border-t border-hairline pt-6">
                  <span className="text-[11px] font-bold tracking-[0.24em] text-champagne">
                    {step.index}
                  </span>
                  <h3 className="mt-4 text-[18px] font-bold">{step.title}</h3>
                  <p className="mt-3 text-[13.5px] leading-[1.85] text-muted">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <p className="mt-10 text-[13px] text-muted">
            Our current benchmarks: {whyHorizon.stats[0].value} residences placed and{' '}
            {whyHorizon.stats[3].value} client satisfaction.
          </p>
        </div>
      </section>

      <WhyHorizon />
      <CtaSection />
    </>
  );
}

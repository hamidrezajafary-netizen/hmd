import { Mail, Phone } from 'lucide-react';
import { team } from '@/data/site';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { CtaSection } from '@/components/sections/CtaSection';

export function Team() {
  return (
    <>
      <PageHero
        label="Team"
        title="Advisors, not agents"
        intro="Four senior specialists, each responsible for a small number of clients at any one time — so the person you meet is the person who does the work."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Team' }]}
      />

      <section className="bg-white py-20 lg:py-24">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:gap-12">
          {team.map((member, index) => (
            <Reveal key={member.id} delay={index * 70}>
              <article className="group flex flex-col gap-6 rounded-xl2 border border-hairline p-5 transition-all duration-500 ease-premium hover:border-champagne/40 hover:shadow-card sm:flex-row sm:p-6">
                <div className="overflow-hidden rounded-xl2 sm:w-[42%] sm:shrink-0">
                  <SmartImage
                    id={member.photo}
                    alt={`${member.name}, ${member.role}`}
                    className="aspect-[4/5] w-full"
                    imgClassName="transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.05]"
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 38vw, 92vw"
                    widths={[420, 640, 840]}
                  />
                </div>

                <div className="flex flex-1 flex-col justify-center">
                  <h2 className="text-[19px] font-bold">{member.name}</h2>
                  <p className="mt-1.5 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-champagne">
                    {member.role}
                  </p>
                  <p className="mt-4 text-[13.5px] leading-[1.85] text-muted">{member.bio}</p>
                  <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-muted">
                    {member.focus}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-hairline pt-5 text-[13px]">
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 text-navy/80 transition-colors hover:text-navy"
                    >
                      <Mail className="h-3.5 w-3.5 text-champagne" aria-hidden="true" />
                      Email
                    </a>
                    <a
                      href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-2 text-navy/80 transition-colors hover:text-navy"
                    >
                      <Phone className="h-3.5 w-3.5 text-champagne" aria-hidden="true" />
                      {member.phone}
                    </a>
                  </div>
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

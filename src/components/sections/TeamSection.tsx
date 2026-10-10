import { ArrowRight, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { team } from '@/data/site';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';

type TeamSectionProps = {
  heading?: string;
  intro?: string;
  showHeading?: boolean;
};

export function TeamSection({
  heading = 'Advisors who know the market first-hand',
  intro = 'Four senior specialists, each responsible for a small number of clients at any one time.',
  showHeading = true,
}: TeamSectionProps) {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="shell">
        {showHeading ? (
          <SectionHeading align="center" label="Team" title={heading} intro={intro} />
        ) : null}

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {team.map((member, index) => (
            <Reveal key={member.id} delay={index * 60}>
              <article className="group">
                <div className="relative overflow-hidden rounded-xl2">
                  <SmartImage
                    id={member.photo}
                    alt={`${member.name}, ${member.role}`}
                    className="aspect-[4/5] w-full"
                    imgClassName="transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.05]"
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 90vw"
                    widths={[420, 640, 840]}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-3 gap-2.5 p-4 opacity-0 transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
                    <a
                      href={`mailto:${member.email}`}
                      aria-label={`Email ${member.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-navy transition hover:bg-champagne"
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <a
                      href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                      aria-label={`Call ${member.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-navy transition hover:bg-champagne"
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                <h3 className="mt-5 text-[16px] font-bold">{member.name}</h3>
                <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-champagne">
                  {member.role}
                </p>
                <p className="mt-3 text-[13px] leading-[1.75] text-muted">{member.focus}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/team"
            className="group inline-flex items-center gap-2 text-[13px] font-semibold text-navy transition-colors hover:text-champagne"
          >
            Meet the full team
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

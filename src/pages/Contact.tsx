import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { site } from '@/data/site';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { InquiryForm } from '@/components/forms/InquiryForm';

const details = [
  { Icon: Phone, label: 'Telephone', value: site.phone, href: site.phoneHref },
  { Icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { Icon: MapPin, label: 'Office', value: site.office },
  { Icon: Clock, label: 'Opening hours', value: site.hours },
];

export function Contact() {
  return (
    <>
      <PageHero
        label="Contact"
        title="Tell us what you are looking for"
        intro="Send a message and a senior advisor will reply personally within one business day — or call the desk directly."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      <section className="bg-white py-20 lg:py-24">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <div className="rounded-2xl border border-hairline p-6 shadow-soft sm:p-8">
              <h2 className="text-[22px] font-bold">Send us an enquiry</h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                Buying, selling, investing or simply exploring the market — we are glad to help.
              </p>
              <InquiryForm type="contact" source="contact-page" className="mt-7" />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={120}>
            <ul className="space-y-4">
              {details.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4 rounded-xl2 border border-hairline bg-ivory p-5">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-champagne shadow-soft">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10.5px] uppercase tracking-[0.2em] text-muted">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-1.5 block break-words text-[14.5px] font-semibold transition-colors hover:text-champagne"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1.5 text-[14.5px] font-semibold leading-relaxed">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="group mt-6 overflow-hidden rounded-xl2">
              <SmartImage
                id="1613977257363-707ba9348227"
                alt="Horizon Properties office setting — modern villa with pool"
                className="aspect-[4/3] w-full"
                imgClassName="transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.05]"
                sizes="(min-width: 1024px) 38vw, 92vw"
                widths={[640, 960, 1440]}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

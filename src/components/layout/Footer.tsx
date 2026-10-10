import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { navItems, services, site } from '@/data/site';
import { Logo } from '@/components/ui/Logo';
import { NewsletterForm } from '@/components/forms/NewsletterForm';

const socials = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: Linkedin },
  { label: 'Facebook', href: 'https://facebook.com', Icon: Facebook },
  { label: 'YouTube', href: 'https://youtube.com', Icon: Youtube },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="shell grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-6 max-w-sm text-[13.5px] leading-[1.85] text-white/60">
            {site.description}
          </p>
          <div className="mt-7 flex gap-2.5">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white/70 transition-all duration-300 ease-premium hover:border-champagne hover:text-champagne"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-champagne">Explore</h2>
          <ul className="mt-5 space-y-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-[13.5px] text-white/65 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-champagne">Services</h2>
          <ul className="mt-5 space-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <Link
                  to="/services"
                  className="text-[13.5px] text-white/65 transition-colors hover:text-white"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.28em] text-champagne">Contact</h2>
          <ul className="mt-5 space-y-3 text-[13.5px] text-white/65">
            <li>
              <a href={site.phoneHref} className="inline-flex items-center gap-2.5 hover:text-white">
                <Phone className="h-3.5 w-3.5 text-champagne" aria-hidden="true" />
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2.5 hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 text-champagne" aria-hidden="true" />
                {site.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-champagne" aria-hidden="true" />
              <span className="leading-relaxed">{site.office}</span>
            </li>
          </ul>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-[12.5px] text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Horizon Properties. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>{site.hours}</span>
            <Link to="/contact" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link to="/contact" className="transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

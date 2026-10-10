import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bath, BedDouble, Calendar, Check, Home, LandPlot, Mail, MapPin, Phone, Ruler, Tag } from 'lucide-react';
import { getProperty, similarProperties } from '@/data/properties';
import { team } from '@/data/site';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';
import { Gallery } from '@/components/property/Gallery';
import { FavoriteButton } from '@/components/property/FavoriteButton';
import { InquiryModal } from '@/components/property/InquiryModal';
import { PropertyCard } from '@/components/property/PropertyCard';
import { NotFound } from '@/pages/NotFound';

export function PropertyDetail() {
  const { slug = '' } = useParams();
  const property = getProperty(slug);
  const [modal, setModal] = useState<'contact' | 'viewing' | null>(null);

  if (!property) return <NotFound />;

  const agent = team.find((member) => member.id === property.agentId) ?? team[0];
  const similar = similarProperties(property, 3);

  const facts = [
    { Icon: BedDouble, label: 'Bedrooms', value: String(property.beds) },
    { Icon: Bath, label: 'Bathrooms', value: String(property.baths) },
    { Icon: Ruler, label: 'Interior', value: `${property.sqft.toLocaleString('en-US')} sq ft` },
    { Icon: LandPlot, label: 'Lot', value: property.lot },
  ];

  return (
    <div className="bg-white pb-28 pt-[100px] sm:pt-[112px] lg:pb-0">
      <div className="shell">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[12px] text-muted">
          <Link to="/" className="transition-colors hover:text-navy">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/properties" className="transition-colors hover:text-navy">
            Properties
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-navy">{property.name}</span>
        </nav>

        <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <Gallery images={property.images} name={property.name} />

            <section className="mt-12 border-t border-hairline pt-10">
              <h2 className="text-[22px] font-bold">About this home</h2>
              <p className="mt-5 text-[14.5px] leading-[1.9] text-muted">{property.description}</p>
            </section>

            <section className="mt-12 border-t border-hairline pt-10">
              <h2 className="text-[22px] font-bold">Key features</h2>
              <ul className="mt-6 grid gap-3.5 sm:grid-cols-2">
                {property.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-navy/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12 border-t border-hairline pt-10">
              <h2 className="text-[22px] font-bold">Amenities</h2>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {property.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="rounded-full border border-hairline bg-ivory px-4 py-2 text-[12.5px] text-navy/80"
                  >
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12 border-t border-hairline pt-10">
              <h2 className="text-[22px] font-bold">Location</h2>
              <div className="mt-6 flex items-start gap-4 rounded-2xl border border-hairline bg-ivory p-6">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-champagne shadow-soft">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[15px] font-bold">
                    {property.city}, {property.state}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">{property.country}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">
                    The exact address is shared with qualified buyers during a private viewing. Schools,
                    commute times and neighbourhood data are available on request.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="order-1 lg:order-2 lg:col-span-5">
            <div className="rounded-2xl border border-hairline p-6 shadow-soft sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-champagne">
                    {property.status} · {property.type}
                  </p>
                  <h1 className="mt-3 text-[26px] leading-[1.15] sm:text-[30px]">{property.name}</h1>
                  <p className="mt-3 flex items-center gap-2 text-[13px] text-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-champagne" aria-hidden="true" />
                    {property.city}, {property.state}, {property.country}
                  </p>
                </div>
                <FavoriteButton
                  propertyId={property.id}
                  propertyName={property.name}
                  withLabel
                  className="shrink-0"
                />
              </div>

              <p className="mt-7 text-[28px] font-extrabold tracking-[-0.02em] sm:text-[32px]">
                {formatPrice(property.price)}
              </p>

              <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-hairline pt-6">
                {facts.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden="true" />
                    <div>
                      <dt className="text-[10.5px] uppercase tracking-[0.18em] text-muted">{label}</dt>
                      <dd className="mt-1 text-[14px] font-semibold">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <dl className="mt-7 space-y-3 border-t border-hairline pt-6 text-[13px]">
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-muted">
                    <Tag className="h-3.5 w-3.5 text-champagne" aria-hidden="true" />
                    Reference
                  </dt>
                  <dd className="font-semibold">{property.id}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-muted">
                    <Home className="h-3.5 w-3.5 text-champagne" aria-hidden="true" />
                    Property type
                  </dt>
                  <dd className="font-semibold">{property.type}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-muted">
                    <Calendar className="h-3.5 w-3.5 text-champagne" aria-hidden="true" />
                    Year built
                  </dt>
                  <dd className="font-semibold">{property.year}</dd>
                </div>
              </dl>

              <div className="mt-7 flex flex-col gap-3">
                <Button size="lg" onClick={() => setModal('contact')}>
                  Contact Agent
                </Button>
                <Button size="lg" variant="outline" onClick={() => setModal('viewing')}>
                  Schedule a Viewing
                </Button>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-2xl border border-hairline bg-ivory p-5">
              <SmartImage
                id={agent.photo}
                alt={agent.name}
                className="h-16 w-16 shrink-0 rounded-full"
                sizes="64px"
                widths={[128, 256]}
              />
              <div className="min-w-0">
                <p className="text-[10.5px] uppercase tracking-[0.22em] text-muted">Your advisor</p>
                <p className="mt-1 text-[15px] font-bold">{agent.name}</p>
                <p className="text-[12.5px] text-champagne">{agent.role}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[12.5px]">
                  <a
                    href={`mailto:${agent.email}`}
                    className="inline-flex items-center gap-1.5 text-navy/75 transition-colors hover:text-navy"
                  >
                    <Mail className="h-3.5 w-3.5 text-champagne" aria-hidden="true" />
                    Email
                  </a>
                  <a
                    href={`tel:${agent.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-1.5 text-navy/75 transition-colors hover:text-navy"
                  >
                    <Phone className="h-3.5 w-3.5 text-champagne" aria-hidden="true" />
                    {agent.phone}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <section className="mt-20 bg-ivory py-16 lg:py-20">
        <div className="shell">
          <SectionHeading
            align="center"
            label="Similar"
            title="Properties you may also like"
            intro="Matched on type, market and price band by our advisory desk."
          />
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item, index) => (
              <Reveal key={item.id} delay={index * 60}>
                <PropertyCard
                  property={item}
                  variant="grid"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-white/95 backdrop-blur lg:hidden">
        <div className="shell safe-bottom flex items-center gap-3 py-3">
          <FavoriteButton
            propertyId={property.id}
            propertyName={property.name}
            size="md"
            className="shrink-0"
          />
          <Button className="flex-1" onClick={() => setModal('contact')}>
            Contact
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setModal('viewing')}>
            Schedule
          </Button>
        </div>
      </div>

      <InquiryModal
        open={modal === 'contact'}
        onClose={() => setModal(null)}
        type="contact"
        title={`Enquire about ${property.name}`}
        description="Your enquiry goes directly to the advisor responsible for this home."
        propertyName={property.name}
        propertySlug={property.slug}
      />
      <InquiryModal
        open={modal === 'viewing'}
        onClose={() => setModal(null)}
        type="viewing"
        title="Schedule a private viewing"
        description="Choose a preferred date and we will confirm the time with the owner."
        propertyName={property.name}
        propertySlug={property.slug}
      />
    </div>
  );
}

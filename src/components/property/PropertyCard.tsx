import { Link } from 'react-router-dom';
import { Bath, BedDouble, MapPin, Ruler } from 'lucide-react';
import type { Property } from '@/data/properties';
import { cx } from '@/lib/cx';
import { formatPrice } from '@/lib/format';
import { SmartImage } from '@/components/ui/SmartImage';
import { FavoriteButton } from '@/components/property/FavoriteButton';

type PropertyCardProps = {
  property: Property;
  variant?: 'portrait' | 'grid';
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function PropertyCard({
  property,
  variant = 'portrait',
  className,
  sizes = '(min-width: 1280px) 25vw, (min-width: 640px) 46vw, 78vw',
  priority = false,
}: PropertyCardProps) {
  const facts = [
    { Icon: BedDouble, value: `${property.beds} bd` },
    { Icon: Bath, value: `${property.baths} ba` },
    { Icon: Ruler, value: `${(property.sqft / 1000).toFixed(1)}k sq ft` },
  ];

  return (
    <article
      className={cx(
        'group flex h-full flex-col overflow-hidden rounded-xl border border-hairline bg-white transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-champagne/40 hover:shadow-card',
        className,
      )}
    >
      <div className="relative">
        <Link
          to={`/properties/${property.slug}`}
          aria-label={`View ${property.name}`}
          className="block"
        >
          <SmartImage
            id={property.images[0]}
            alt={`${property.name} in ${property.city}, ${property.state}`}
            className={variant === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'}
            imgClassName="transition-transform duration-[1100ms] ease-premium group-hover:scale-[1.06]"
            sizes={sizes}
            priority={priority}
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-navy backdrop-blur">
            {property.status}
          </span>
        </Link>
        <FavoriteButton
          propertyId={property.id}
          propertyName={property.name}
          className="absolute right-3 top-3"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[15px] font-bold leading-snug">
          <Link
            to={`/properties/${property.slug}`}
            className="transition-colors duration-300 hover:text-champagne"
          >
            {property.name}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-champagne" aria-hidden="true" />
          {property.city}, {property.state}, {property.country}
        </p>

        {variant === 'grid' ? (
          <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-muted">
            {facts.map(({ Icon, value }) => (
              <li key={value} className="inline-flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-navy/40" aria-hidden="true" />
                {value}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex items-end justify-between border-t border-hairline pt-3.5 lg:mt-5">
          <span className="text-[15px] font-extrabold tracking-[-0.01em]">
            {formatPrice(property.price)}
          </span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-muted">
            {property.type}
          </span>
        </div>
      </div>
    </article>
  );
}

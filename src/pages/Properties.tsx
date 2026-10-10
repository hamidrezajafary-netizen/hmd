import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { properties } from '@/data/properties';
import { useFavorites } from '@/hooks/useFavorites';
import {
  activeFilterCount,
  applyFilters,
  emptyFilters,
  filtersFromParams,
  paramsFromFilters,
  type PropertyFilterState,
} from '@/lib/filters';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { PropertyCarousel } from '@/components/property/PropertyCarousel';
import { PropertyCard } from '@/components/property/PropertyCard';
import { CtaSection } from '@/components/sections/CtaSection';

export function Properties() {
  const [params, setParams] = useSearchParams();
  const key = params.toString();
  const filters = useMemo(() => filtersFromParams(new URLSearchParams(key)), [key]);
  const { favorites } = useFavorites();

  const results = useMemo(
    () => applyFilters(properties, filters, favorites),
    [filters, favorites],
  );

  const featured = useMemo(() => properties.filter((property) => property.featured), []);
  const isPristine = activeFilterCount(filters) === 0;

  const update = (patch: Partial<PropertyFilterState>) => {
    setParams(paramsFromFilters({ ...filters, ...patch }), { replace: true });
  };

  const reset = () => setParams(new URLSearchParams(), { replace: true });

  return (
    <>
      <PageHero
        label="Portfolio"
        title="Find the home that fits the life you are planning"
        intro="Twelve residences across six states, curated by our advisory desk. Filter by location, type, size and price — your search is saved in the address bar so you can share it."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Properties' }]}
      />

      <div className="shell relative z-10 -mt-8 sm:-mt-10">
        <PropertyFilters
          state={filters}
          onChange={update}
          onReset={reset}
          savedCount={favorites.length}
          resultCount={results.length}
        />
      </div>

      {isPristine ? (
        <section className="overflow-hidden bg-ivory py-16 lg:py-20">
          <div className="shell">
            <SectionHeading
              align="center"
              label="Featured"
              title="Featured Properties"
              intro="The homes our advisors are asked about most this month."
            />
          </div>
          <div className="shell mt-12">
            <PropertyCarousel properties={featured} />
          </div>
        </section>
      ) : null}

      <section className="bg-white py-16 lg:py-20">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="section-title">{isPristine ? 'All Properties' : 'Search Results'}</h2>
            {filters.saved ? (
              <p className="text-[13px] text-muted">
                Showing the homes you have saved on this device.
              </p>
            ) : null}
          </div>

          {results.length > 0 ? (
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((property, index) => (
                <Reveal key={property.id} delay={Math.min(index, 5) * 50}>
                  <PropertyCard
                    property={property}
                    variant="grid"
                    priority={index < 3}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center rounded-2xl border border-hairline bg-ivory px-6 py-16 text-center">
              <SearchX className="h-9 w-9 text-champagne" aria-hidden="true" />
              <h3 className="mt-5 text-[19px] font-bold">No properties match that search</h3>
              <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">
                Try widening the price range or clearing the location filter. Our advisors also hold
                off-market listings that are not published here.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button onClick={reset} variant="navy">
                  Clear filters
                </Button>
                <Button to="/contact" variant="outline">
                  Ask an advisor
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaSection />
    </>
  );
}

export { emptyFilters };

import { ChevronDown, Heart, RotateCcw, Search } from 'lucide-react';
import { cx } from '@/lib/cx';
import { states } from '@/data/properties';
import {
  activeFilterCount,
  bathroomOptions,
  bedroomOptions,
  emptyFilters,
  priceBands,
  propertyTypes,
  sortOptions,
  type PropertyFilterState,
} from '@/lib/filters';

type PropertyFiltersProps = {
  state: PropertyFilterState;
  onChange: (patch: Partial<PropertyFilterState>) => void;
  onReset: () => void;
  savedCount: number;
  resultCount: number;
};

const selectClass =
  'h-11 w-full appearance-none rounded-lg border border-hairline bg-white pl-3.5 pr-9 text-[13px] text-navy transition-colors hover:border-navy/30 focus:border-navy focus:outline-none';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-muted">{label}</span>
      <span className="relative block">
        {children}
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40"
          aria-hidden="true"
        />
      </span>
    </label>
  );
}

export function PropertyFilters({
  state,
  onChange,
  onReset,
  savedCount,
  resultCount,
}: PropertyFiltersProps) {
  const activeCount = activeFilterCount(state);

  return (
    <section aria-label="Property search" className="rounded-xl border border-hairline bg-white p-5 shadow-soft sm:p-6">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne"
          aria-hidden="true"
        />
        <input
          type="search"
          value={state.q}
          onChange={(event) => onChange({ q: event.target.value })}
          placeholder="Search by name, city or listing reference"
          aria-label="Search properties"
          className="h-12 w-full rounded-lg border border-hairline bg-warm/60 pl-11 pr-4 text-[14px] text-navy placeholder:text-muted/70 focus:border-navy focus:bg-white focus:outline-none"
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Field label="Location">
          <select
            className={selectClass}
            value={state.state}
            onChange={(event) => onChange({ state: event.target.value })}
            aria-label="Filter by location"
          >
            <option value="any">All locations</option>
            {states.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Property type">
          <select
            className={selectClass}
            value={state.type}
            onChange={(event) => onChange({ type: event.target.value })}
            aria-label="Filter by property type"
          >
            <option value="any">All types</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Bedrooms">
          <select
            className={selectClass}
            value={state.beds}
            onChange={(event) => onChange({ beds: event.target.value })}
            aria-label="Filter by bedrooms"
          >
            {bedroomOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Bathrooms">
          <select
            className={selectClass}
            value={state.baths}
            onChange={(event) => onChange({ baths: event.target.value })}
            aria-label="Filter by bathrooms"
          >
            {bathroomOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Price range">
          <select
            className={selectClass}
            value={state.price}
            onChange={(event) => onChange({ price: event.target.value })}
            aria-label="Filter by price range"
          >
            {priceBands.map((band) => (
              <option key={band.id} value={band.id}>
                {band.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Sort by">
          <select
            className={selectClass}
            value={state.sort}
            onChange={(event) => onChange({ sort: event.target.value })}
            aria-label="Sort results"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ saved: !state.saved })}
            aria-pressed={state.saved}
            className={cx(
              'inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-[13px] font-semibold transition-all duration-300 ease-premium',
              state.saved
                ? 'border-champagne bg-champagne/10 text-navy'
                : 'border-hairline text-navy hover:border-navy/30',
            )}
          >
            <Heart className={cx('h-4 w-4', state.saved && 'fill-current text-champagne')} aria-hidden="true" />
            Saved only
            <span className="text-muted">({savedCount})</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={activeCount === 0}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-hairline px-4 text-[13px] font-medium text-navy transition-colors hover:border-navy/30 disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset search
          </button>
        </div>

        <p aria-live="polite" className="text-[13px] text-muted">
          <span className="font-semibold text-navy">{resultCount}</span>{' '}
          {resultCount === 1 ? 'property' : 'properties'}
          {activeCount > 0 ? ` · ${activeCount} filter${activeCount === 1 ? '' : 's'} applied` : ''}
        </p>
      </div>

      {state.q || activeCount > 1 ? null : (
        <p className="mt-4 text-[12.5px] text-muted">
          Tip: try “Malibu” or “Penthouse” — filters are stored in the address bar, so you can share a
          search.
        </p>
      )}
    </section>
  );
}

export { emptyFilters };

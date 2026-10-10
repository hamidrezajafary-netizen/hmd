import type { Property } from '@/data/properties';
import { bedroomOptions, bathroomOptions, priceBands, propertyTypes, sortOptions } from '@/data/properties';

export type PropertyFilterState = {
  q: string;
  state: string;
  type: string;
  beds: string;
  baths: string;
  price: string;
  sort: string;
  saved: boolean;
};

export const emptyFilters: PropertyFilterState = {
  q: '',
  state: 'any',
  type: 'any',
  beds: 'any',
  baths: 'any',
  price: 'any',
  sort: 'featured',
  saved: false,
};

export function filtersFromParams(params: URLSearchParams): PropertyFilterState {
  return {
    q: params.get('q') ?? emptyFilters.q,
    state: params.get('state') ?? emptyFilters.state,
    type: params.get('type') ?? emptyFilters.type,
    beds: params.get('beds') ?? emptyFilters.beds,
    baths: params.get('baths') ?? emptyFilters.baths,
    price: params.get('price') ?? emptyFilters.price,
    sort: params.get('sort') ?? emptyFilters.sort,
    saved: params.get('saved') === '1',
  };
}

export function paramsFromFilters(filters: PropertyFilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.state !== 'any') params.set('state', filters.state);
  if (filters.type !== 'any') params.set('type', filters.type);
  if (filters.beds !== 'any') params.set('beds', filters.beds);
  if (filters.baths !== 'any') params.set('baths', filters.baths);
  if (filters.price !== 'any') params.set('price', filters.price);
  if (filters.sort !== 'featured') params.set('sort', filters.sort);
  if (filters.saved) params.set('saved', '1');
  return params;
}

export function activeFilterCount(filters: PropertyFilterState): number {
  return [
    filters.q.trim() !== '',
    filters.state !== 'any',
    filters.type !== 'any',
    filters.beds !== 'any',
    filters.baths !== 'any',
    filters.price !== 'any',
    filters.saved,
  ].filter(Boolean).length;
}

export function applyFilters(
  properties: Property[],
  filters: PropertyFilterState,
  favorites: string[],
): Property[] {
  const query = filters.q.trim().toLowerCase();
  const band = priceBands.find((item) => item.id === filters.price) ?? priceBands[0];
  const minBeds = Number(bedroomOptions.find((item) => item.id === filters.beds)?.min ?? 0);
  const minBaths = Number(bathroomOptions.find((item) => item.id === filters.baths)?.min ?? 0);

  const result = properties.filter((property) => {
    if (filters.saved && !favorites.includes(property.id)) return false;
    if (filters.state !== 'any' && property.state !== filters.state) return false;
    if (filters.type !== 'any' && property.type !== filters.type) return false;
    if (property.beds < minBeds || property.baths < minBaths) return false;
    if (property.price < band.min || property.price > band.max) return false;
    if (!query) return true;
    return [property.name, property.city, property.state, property.type, property.id]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  switch (filters.sort) {
    case 'price-desc':
      return result.sort((a, b) => b.price - a.price);
    case 'price-asc':
      return result.sort((a, b) => a.price - b.price);
    case 'size-desc':
      return result.sort((a, b) => b.sqft - a.sqft);
    case 'newest':
      return result.sort((a, b) => b.year - a.year);
    case 'featured':
    default:
      return result.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.price - a.price,
      );
  }
}

export { bathroomOptions, bedroomOptions, priceBands, propertyTypes, sortOptions };

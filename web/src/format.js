export const CURRENCY_CODE = 'USD';
export const CURRENCY_SYMBOL = '$';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: CURRENCY_CODE,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

export function formatPrice(value) {
  return priceFormatter.format(Number(value));
}

/** Spelled-out amount, used for screen-reader labels. */
export function formatPriceLabel(value) {
  return `${Number(value).toLocaleString('en-US')} dollars`;
}

function toDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(isoDate, days) {
  const date = toDate(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function formatDate(isoDate) {
  return dateFormatter.format(toDate(isoDate));
}

export function formatStay(fromIso, nights) {
  const checkOut = addDays(fromIso, nights);
  return `${shortDateFormatter.format(toDate(fromIso))} — ${shortDateFormatter.format(toDate(checkOut))}`;
}

export function nightsLabel(nights) {
  return `${nights} ${nights === 1 ? 'night' : 'nights'}`;
}

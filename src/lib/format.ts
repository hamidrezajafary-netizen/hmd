export function formatPrice(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `$${millions.toFixed(millions % 1 === 0 ? 0 : 2)} Million`;
  }
  return `$${value.toLocaleString('en-US')}`;
}

export function formatSqft(value: number): string {
  return `${value.toLocaleString('en-US')} sq ft`;
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

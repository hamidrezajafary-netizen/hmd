import { formatPrice, formatPriceLabel } from '../format.js';

export default function BedCard({ bed, isSelected, onSelect }) {
  const { bedNumber, roomLabel, pricePerNight, isAvailable } = bed;

  const statusText = isAvailable ? 'Available' : 'Booked, unavailable';
  const label = `${bedNumber}, ${roomLabel}, ${statusText}, ${formatPriceLabel(pricePerNight)} per night`;

  const classes = ['bed-card'];
  if (isSelected) classes.push('is-selected');
  if (!isAvailable) classes.push('is-booked');

  return (
    <button
      type="button"
      className={classes.join(' ')}
      aria-label={label}
      aria-pressed={isSelected}
      disabled={!isAvailable}
      onClick={() => onSelect(bed.id)}
    >
      <span className="bed-card__dot" aria-hidden="true" />

      <span className="bed-card__body">
        <span className="bed-card__number">{bedNumber}</span>
        <span className="bed-card__room">{roomLabel}</span>
      </span>

      <span className="bed-card__price" aria-hidden="true">
        {formatPrice(pricePerNight)}
        <small>per night</small>
      </span>

      <span className="bed-card__check" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}

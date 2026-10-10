import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { cx } from '@/lib/cx';

type FavoriteButtonProps = {
  propertyId: string;
  propertyName: string;
  className?: string;
  withLabel?: boolean;
  size?: 'sm' | 'md';
};

export function FavoriteButton({
  propertyId,
  propertyName,
  className,
  withLabel = false,
  size = 'sm',
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(propertyId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${propertyName} from saved` : `Save ${propertyName}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(propertyId);
      }}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 ease-premium',
        withLabel
          ? 'h-11 border border-navy/15 px-5 text-[13px] font-semibold text-navy hover:border-navy/40'
          : size === 'md'
            ? 'h-11 w-11 border border-hairline bg-white text-navy/70 hover:border-navy/30'
            : 'h-9 w-9 border border-white/70 bg-white/85 text-navy/70 backdrop-blur hover:bg-white',
        saved && (withLabel ? 'border-champagne bg-champagne/10 text-navy' : 'text-champagne'),
        className,
      )}
    >
      <Heart className={cx('h-4 w-4', saved && 'fill-current')} aria-hidden="true" />
      {withLabel ? <span>{saved ? 'Saved' : 'Save'}</span> : null}
    </button>
  );
}

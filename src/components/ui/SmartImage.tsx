import { useState } from 'react';
import { photo, photoSet } from '@/lib/images';
import { cx } from '@/lib/cx';

type SmartImageProps = {
  id: string;
  alt: string;
  /** Wrapper classes — use these for aspect ratio, radius and sizing. */
  className?: string;
  /** Extra classes for the <img> itself (e.g. hover zoom). */
  imgClassName?: string;
  sizes?: string;
  widths?: number[];
  priority?: boolean;
};

/**
 * Responsive, lazily-loaded image with a warm placeholder so large photography
 * never shifts the layout while it loads.
 */
export function SmartImage({
  id,
  alt,
  className,
  imgClassName,
  sizes = '100vw',
  widths = [640, 960, 1440, 1920],
  priority = false,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cx('relative overflow-hidden bg-warm', className)}>
      <img
        src={photo(id, 1440)}
        srcSet={photoSet(id, widths)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setLoaded(true)}
        className={cx(
          'h-full w-full object-cover transition-opacity duration-700 ease-premium',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  );
}

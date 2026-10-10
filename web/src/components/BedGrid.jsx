import { useRef } from 'react';

import BedCard from './BedCard.jsx';

const NAV_KEYS = new Set([
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
]);

export default function BedGrid({ beds, loading, selectedId, onSelect }) {
  const gridRef = useRef(null);

  // Arrow-key navigation across the bed cells. Booked beds are disabled and
  // therefore skipped, so only selectable beds receive focus.
  const handleKeyDown = (event) => {
    if (!NAV_KEYS.has(event.key)) return;

    const grid = gridRef.current;
    if (!grid) return;

    const cells = Array.from(grid.querySelectorAll('.bed-card:not([disabled])'));
    if (cells.length === 0) return;

    const currentIndex = cells.indexOf(document.activeElement);
    const columns = cells.filter((cell) => cell.offsetTop === cells[0].offsetTop).length || 1;

    let nextIndex = currentIndex < 0 ? 0 : currentIndex;

    if (event.key === 'ArrowRight') nextIndex = currentIndex + 1;
    if (event.key === 'ArrowLeft') nextIndex = currentIndex - 1;
    if (event.key === 'ArrowDown') nextIndex = (currentIndex < 0 ? 0 : currentIndex) + columns;
    if (event.key === 'ArrowUp') nextIndex = (currentIndex < 0 ? 0 : currentIndex) - columns;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = cells.length - 1;

    nextIndex = Math.min(cells.length - 1, Math.max(0, nextIndex));
    cells[nextIndex].focus();
    event.preventDefault();
  };

  if (loading && beds.length === 0) {
    return (
      <div className="bed-grid bed-grid--skeleton" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <span className="bed-skeleton" key={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="bed-grid"
      ref={gridRef}
      role="group"
      aria-label="Bed availability. Use the arrow keys to move between beds."
      onKeyDown={handleKeyDown}
    >
      {beds.map((bed) => (
        <BedCard
          key={bed.id}
          bed={bed}
          isSelected={bed.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

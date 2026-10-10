export type Burger = {
  id: string;
  name: string;
  price: number;
  description: string;
  /**
   * Where this burger sits in the **final frame** of the clip, as a percentage of the frame
   * itself (x across, y down) — never of the viewport. `HotspotOverlay` maps the overlay onto the
   * rendered video box, so these stay true at any aspect ratio.
   *
   * Measured off the last frame, not guessed: the burgers occupy a band roughly 40–66% down the
   * frame and their clusters centre near 12.5 / 36 / 60.5 / 85% across (the case is itself a
   * little left of centre). Re-measure them whenever the footage changes — see
   * `tools/anchor-grid.html`. The dot marks the burger; the card hangs below it.
   */
  anchor: { x: number; y: number };
};

/**
 * Left to right, exactly as the burgers stand in the display case — the order is the mapping.
 */
export const MENU: Burger[] = [
  {
    id: 'classic-cheeseburger',
    name: 'Classic Cheeseburger',
    price: 3.49,
    description:
      'A flame-grilled beef patty with melted American cheese, crisp pickles, onion and ketchup on a toasted sesame bun.',
    anchor: { x: 12.5, y: 53 },
  },
  {
    id: 'chicken-royale',
    name: 'Chicken Royale',
    price: 5.99,
    description:
      'A golden, crispy chicken fillet piled with cool mayo and fresh lettuce in a soft sesame bun.',
    anchor: { x: 36, y: 53 },
  },
  {
    id: 'double-whopper',
    name: 'Double Whopper',
    price: 7.49,
    description:
      'Two flame-grilled beef patties, ripe tomatoes, crisp lettuce, mayo, pickles and onions on a sesame bun.',
    anchor: { x: 60.5, y: 53 },
  },
  {
    id: 'bacon-king',
    name: 'The Bacon King',
    price: 9.99,
    description:
      'Two beef patties topped with thick-cut smoked bacon, melted cheese and a smoky BBQ sauce.',
    anchor: { x: 85, y: 53 },
  },
];

export function findBurger(id: string): Burger | undefined {
  return MENU.find((burger) => burger.id === id);
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

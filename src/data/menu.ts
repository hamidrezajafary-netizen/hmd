export type Burger = {
  id: string;
  name: string;
  price: number;
  description: string;
  /**
   * Where this burger sits in the **final frame** of the clip, as a percentage of the frame
   * itself (x across, y down) — never of the viewport. `HotspotOverlay` maps the overlay onto the
   * rendered video box, so these stay true at any aspect ratio. Re-tune them whenever the footage
   * changes: `public/_tune/` renders the last frame over a percentage grid.
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
    anchor: { x: 15, y: 60 },
  },
  {
    id: 'chicken-royale',
    name: 'Chicken Royale',
    price: 5.99,
    description:
      'A golden, crispy chicken fillet piled with cool mayo and fresh lettuce in a soft sesame bun.',
    anchor: { x: 38, y: 60 },
  },
  {
    id: 'double-whopper',
    name: 'Double Whopper',
    price: 7.49,
    description:
      'Two flame-grilled beef patties, ripe tomatoes, crisp lettuce, mayo, pickles and onions on a sesame bun.',
    anchor: { x: 62, y: 60 },
  },
  {
    id: 'bacon-king',
    name: 'The Bacon King',
    price: 9.99,
    description:
      'Two beef patties topped with thick-cut smoked bacon, melted cheese and a smoky BBQ sauce.',
    anchor: { x: 85, y: 60 },
  },
];

export function findBurger(id: string): Burger | undefined {
  return MENU.find((burger) => burger.id === id);
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

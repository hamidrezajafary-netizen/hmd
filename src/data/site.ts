/**
 * Every string and number the experience shows lives here, so copy can be changed in one place.
 */

export type Chapter = {
  id: string;
  /** Header navigation label. */
  label: string;
  /** Scroll progress (0–1) the chapter sits at — also where its nav link jumps to. */
  at: number;
  /** Caption shown over the video while the visitor is in this window. */
  title: string;
  note: string;
};

export const brand = {
  name: 'Khoshmazeh',
  script: 'خوشمزه',
  tagline: 'Premium burgers',
};

/**
 * Chapters are also the header navigation. The site is a single screen, so a nav link simply
 * flies the burger to the layer that belongs to it.
 */
export const chapters: Chapter[] = [
  {
    id: 'menu',
    label: 'Menu',
    at: 0.18,
    title: 'Hand-pressed 100% premium beef',
    note: 'Ground fresh every morning, seared to order on a flat-top grill.',
  },
  {
    id: 'story',
    label: 'Story',
    at: 0.48,
    title: 'Double cheddar, melted slowly',
    note: 'Aged cheddar laid over the patty while it is still on the grill.',
  },
  {
    id: 'locations',
    label: 'Locations',
    at: 0.76,
    title: 'Lettuce and tomato, picked this week',
    note: 'Crisp leaves, ripe tomato, and a brioche bun baked two hours ago.',
  },
  {
    id: 'contact',
    label: 'Contact',
    at: 0.99,
    title: 'Stacked back together, ready to eat',
    note: 'Order ahead and it is in your hands in about five minutes.',
  },
];

export const product = {
  id: 'signature',
  name: 'The Signature Khoshmazeh Burger',
  description: '100% premium beef, double melted cheddar, fresh lettuce, and our secret sauce.',
  price: 12.99,
  chips: ['100% beef', 'Double cheddar', 'Secret sauce'],
  note: 'Ready in about 5 minutes',
};

export const MAX_QTY = 20;

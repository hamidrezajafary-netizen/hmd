export type FontKey = 'jakarta' | 'display' | 'system';
export type MockupBg = 'desk' | 'slate' | 'paper';

/** Everything the visitor can edit. All values are plain strings so they round-trip through storage. */
export type CardSpec = {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  tagline: string;
  descriptor: string;
  qrUrl: string;
  navy: string;
  accent: string;
  paper: string;
  font: FontKey;
};

/** Contact fields are deliberately left as bracketed placeholders — nothing here is invented. */
export const DEFAULT_SPEC: CardSpec = {
  name: 'Vahidreza Jafary',
  title: 'Senior Cloud Architect | Founder',
  email: '[Your Email]',
  phone: '[Your Phone Number]',
  website: '[Your Website]',
  location: 'Tampere, Finland',
  tagline: 'Make Every Customer Feel Understood.',
  descriptor: 'AI-Powered Customer Experience Platform',
  qrUrl: '',
  navy: '#0B1530',
  accent: '#3D7BFF',
  paper: '#FFFFFF',
  font: 'jakarta',
};

export const SERVICES = 'AI Receptionist · Multilingual Assistance · Smart Commerce';

export const FONTS: Record<FontKey, { label: string; head: string; body: string; headWeight: number }> = {
  jakarta: {
    label: 'Plus Jakarta Sans',
    head: "'Plus Jakarta Sans Variable', system-ui, sans-serif",
    body: "'Plus Jakarta Sans Variable', system-ui, sans-serif",
    headWeight: 800,
  },
  display: {
    label: 'Archivo Black + Jakarta',
    head: "'Archivo Black', 'Plus Jakarta Sans Variable', sans-serif",
    body: "'Plus Jakarta Sans Variable', system-ui, sans-serif",
    headWeight: 400,
  },
  system: {
    label: 'System Sans',
    head: "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
    body: "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
    headWeight: 700,
  },
};

const KEY = 'maison-card-spec-v1';

export function loadSpec(): CardSpec {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_SPEC, ...(JSON.parse(raw) as Partial<CardSpec>) };
  } catch {
    /* corrupt or unavailable storage — fall back to defaults */
  }
  return DEFAULT_SPEC;
}

export function saveSpec(spec: CardSpec): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(spec));
  } catch {
    /* storage full / blocked — editing still works, it just won't persist */
  }
}

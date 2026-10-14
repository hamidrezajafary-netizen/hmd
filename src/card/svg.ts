import QRCode from 'qrcode';
import { FONTS, SERVICES, type CardSpec } from './spec';

export type Side = 'front' | 'back';

/**
 * Card geometry, in millimetres. The artboard is 91 × 61: the 85 × 55 trim plus 3 mm bleed on every
 * side. The safe area sits 4 mm inside the trim.
 */
export const BLEED = 3;
export const TRIM = { w: 85, h: 55 };
export const ART = { w: 91, h: 61 };

type Options = {
  /** Show the full artboard with bleed (print) or crop to the trimmed card (digital). */
  bleed: boolean;
  /** Draw trim + safe-area guides. Never set for exports. */
  guides?: boolean;
  /** Explicit CSS size ("91mm", "1075px"). Omit to let the host element size it. */
  width?: string;
  height?: string;
  /** @font-face rules, for standalone files that cannot see the page's fonts. */
  fontCss?: string;
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The Maison mark: an M drawn as two connected peaks, with signal nodes at its three vertices. */
function mark(x: number, y: number, size: number, ink: string, accent: string): string {
  return `<g transform="translate(${x} ${y}) scale(${size / 24})">
    <path d="M4 20V6l8 8 8-8v14" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="14" r="4.2" fill="none" stroke="${accent}" stroke-width="1" opacity=".55"/>
    <circle cx="4" cy="6" r="2.1" fill="${accent}"/>
    <circle cx="12" cy="14" r="2.1" fill="${accent}"/>
    <circle cx="20" cy="6" r="2.1" fill="${accent}"/>
  </g>`;
}

/** Vector QR: one path of square modules over a quiet-zone plate. */
function qr(url: string, x: number, y: number, size: number, ink: string, paper: string): string {
  const pad = 1.4;
  const plate = `<rect x="${x - pad}" y="${y - pad}" width="${size + pad * 2}" height="${size + pad * 2}" fill="${paper}"/>`;
  if (!url.trim()) {
    return `${plate}
      <rect x="${x}" y="${y}" width="${size}" height="${size}" fill="none" stroke="${ink}" stroke-width=".25" stroke-dasharray="1 .8" opacity=".55"/>
      <text x="${x + size / 2}" y="${y + size / 2 - 0.2}" text-anchor="middle" font-size="3.4" font-weight="800" fill="${ink}" opacity=".6">QR</text>
      <text x="${x + size / 2}" y="${y + size / 2 + 3}" text-anchor="middle" font-size="1.6" fill="${ink}" opacity=".6">add a URL</text>`;
  }
  const code = QRCode.create(url.trim(), { errorCorrectionLevel: 'M' });
  const n = code.modules.size;
  const cell = size / n;
  let d = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (code.modules.data[r * n + c]) d += `M${+(x + c * cell).toFixed(3)} ${+(y + r * cell).toFixed(3)}h${+cell.toFixed(3)}v${+cell.toFixed(3)}h-${+cell.toFixed(3)}z`;
    }
  }
  return `${plate}<path d="${d}" fill="${ink}" shape-rendering="crispEdges"/>`;
}

function front(s: CardSpec): string {
  const f = FONTS[s.font];
  const nodes = [
    { x: 60, y: 14, t: 'Hello' },
    { x: 71, y: 9, t: 'Hei' },
    { x: 80, y: 19, t: 'Hallo' },
    { x: 69, y: 27, t: 'Hej' },
    { x: 88, y: 31, t: '' },
  ];
  const links = [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4], [1, 3]];
  const lines = links
    .map(([a, b]) => `<line x1="${nodes[a].x}" y1="${nodes[a].y}" x2="${nodes[b].x}" y2="${nodes[b].y}" stroke="${s.accent}" stroke-width=".22" opacity=".5"/>`)
    .join('');
  const dots = nodes
    .map(
      (n) =>
        `<circle cx="${n.x}" cy="${n.y}" r=".9" fill="${s.accent}"/>` +
        (n.t ? `<text x="${n.x + 1.7}" y="${n.y + 0.55}" font-size="1.9" fill="#FFFFFF" opacity=".5" font-family="${f.body}">${n.t}</text>` : ''),
    )
    .join('');
  return `<rect width="${ART.w}" height="${ART.h}" fill="${s.navy}"/>
    <g>${lines}${dots}</g>
    <circle cx="60" cy="14" r="2.6" fill="none" stroke="${s.accent}" stroke-width=".18" opacity=".5"/>
    ${mark(10, 10.5, 7, '#FFFFFF', s.accent)}
    <text x="10" y="33" font-size="9" font-weight="${f.headWeight}" letter-spacing="-.2" fill="#FFFFFF" font-family="${f.head}">Maison AI</text>
    <text x="10.2" y="41.2" font-size="2.9" fill="#FFFFFF" font-family="${f.body}" font-weight="500">${esc(s.tagline)}</text>
    <rect x="10.2" y="44.2" width="6" height=".35" fill="${s.accent}"/>
    <text x="10.2" y="49.6" font-size="2.1" letter-spacing=".32" fill="${s.accent}" font-family="${f.body}" font-weight="700">${esc(s.descriptor.toUpperCase())}</text>`;
}

function back(s: CardSpec): string {
  const f = FONTS[s.font];
  const rows: [string, string][] = [
    ['Email', s.email],
    ['Phone', s.phone],
    ['Website', s.website],
    ['Location', s.location],
  ];
  const contacts = rows
    .map(([label, value], i) => {
      const y = 41 + i * 4.2;
      return `<text x="7" y="${y}" font-size="2.2" font-family="${f.body}"><tspan fill="${s.navy}" opacity=".55" font-weight="600">${label}: </tspan><tspan fill="${s.navy}" font-weight="600">${esc(value)}</tspan></text>`;
    })
    .join('');
  return `<rect width="${ART.w}" height="${ART.h}" fill="${s.paper}"/>
    ${mark(7, 6.6, 5.4, s.navy, s.accent)}
    <text x="13.6" y="10.8" font-size="3" letter-spacing=".5" font-weight="${f.headWeight}" fill="${s.navy}" font-family="${f.head}">MAISON AI</text>
    <text x="7" y="17" font-size="2" letter-spacing=".05" fill="${s.navy}" opacity=".8" font-family="${f.body}" font-weight="600">${esc(SERVICES)}</text>
    <rect x="7" y="20" width="77" height=".2" fill="${s.navy}" opacity=".18"/>
    <rect x="7" y="23.4" width=".9" height="9.6" fill="${s.accent}"/>
    <text x="10" y="27.8" font-size="4.6" font-weight="${f.headWeight}" fill="${s.navy}" font-family="${f.head}">${esc(s.name)}</text>
    <text x="10" y="32.4" font-size="2.3" fill="${s.navy}" opacity=".78" font-family="${f.body}" font-weight="600">${esc(s.title)}</text>
    ${contacts}
    ${qr(s.qrUrl, 66, 34, 18, s.navy, s.paper)}`;
}

function guides(): string {
  const safe = 4;
  return `<g fill="none" stroke-width=".18" stroke-dasharray=".8 .6">
    <rect x="${BLEED}" y="${BLEED}" width="${TRIM.w}" height="${TRIM.h}" stroke="#FF3B6B"/>
    <rect x="${BLEED + safe}" y="${BLEED + safe}" width="${TRIM.w - safe * 2}" height="${TRIM.h - safe * 2}" stroke="#16D9C0"/>
  </g>`;
}

/** One complete, standalone SVG for a side. The same string drives preview, print and PNG export. */
export function buildCardSvg(side: Side, spec: CardSpec, o: Options): string {
  const vb = o.bleed ? `0 0 ${ART.w} ${ART.h}` : `${BLEED} ${BLEED} ${TRIM.w} ${TRIM.h}`;
  const size = o.width ? ` width="${o.width}" height="${o.height}"` : ' style="display:block;width:100%;height:auto"';
  const defs = o.fontCss ? `<defs><style>${o.fontCss}</style></defs>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${size} role="img" aria-label="Maison AI business card, ${side}">${defs}${side === 'front' ? front(spec) : back(spec)}${o.guides ? guides() : ''}</svg>`;
}

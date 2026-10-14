import jakartaUrl from '@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2?url';
import archivoUrl from '@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff2?url';
import { ART, TRIM, buildCardSvg, type Side } from './svg';
import type { CardSpec } from './spec';

let fontCssPromise: Promise<string> | undefined;

async function toDataUri(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** A standalone SVG cannot see the page's fonts, so the two bundled faces are inlined. */
function fontCss(): Promise<string> {
  fontCssPromise ??= Promise.all([toDataUri(jakartaUrl), toDataUri(archivoUrl)]).then(
    ([jakarta, archivo]) =>
      `@font-face{font-family:'Plus Jakarta Sans Variable';font-weight:200 800;src:url(${jakarta}) format('woff2')}` +
      `@font-face{font-family:'Archivo Black';font-weight:400;src:url(${archivo}) format('woff2')}`,
  );
  return fontCssPromise;
}

const MM_PER_INCH = 25.4;

/** Trimmed card (no bleed/guides) as a PNG at the given DPI — for sharing digitally. */
export async function downloadPng(side: Side, spec: CardSpec, dpi = 600): Promise<void> {
  const w = Math.round((TRIM.w / MM_PER_INCH) * dpi);
  const h = Math.round((TRIM.h / MM_PER_INCH) * dpi);
  const svg = buildCardSvg(side, spec, { bleed: false, width: `${w}px`, height: `${h}px`, fontCss: await fontCss() });
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
  if (!blob) throw new Error('PNG encoding failed');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `maison-ai-card-${side}-${dpi}dpi.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Print-ready pages (91 × 61 mm, bleed included) for the browser's "Save as PDF". */
export function printSheet(spec: CardSpec): string {
  return (['front', 'back'] as const)
    .map(
      (side) =>
        `<div style="width:${ART.w}mm;height:${ART.h}mm;overflow:hidden;${side === 'front' ? 'break-after:page' : ''}">${buildCardSvg(
          side,
          spec,
          { bleed: true, width: `${ART.w}mm`, height: `${ART.h}mm` },
        )}</div>`,
    )
    .join('');
}

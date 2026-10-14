import { useState, type ReactNode } from 'react';
import { downloadPng } from './exporter';
import { BACKGROUNDS } from './CardMockup';
import { FONTS, type CardSpec, type FontKey, type MockupBg } from './spec';

type Props = {
  spec: CardSpec;
  onChange: (patch: Partial<CardSpec>) => void;
  onReset: () => void;
  bg: MockupBg;
  onBg: (bg: MockupBg) => void;
};

const input =
  'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#3D7BFF] focus:bg-white/[0.07]';

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3 border-0 p-0">
      <legend className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#7FA6FF]">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-400">{label}</span>
      <input className={input} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Swatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="h-8 w-8 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
        aria-label={label}
      />
      <span className="min-w-0 text-xs leading-tight text-slate-300">
        {label}
        <span className="block font-mono text-[11px] text-slate-500">{value}</span>
      </span>
    </label>
  );
}

export function EditorPanel({ spec, onChange, onReset, bg, onBg }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const exportPng = async (side: 'front' | 'back') => {
    setBusy(side);
    setError(null);
    try {
      await downloadPng(side, spec);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setBusy(null);
    }
  };

  return (
    <aside className="space-y-7 rounded-3xl bg-[#0E1630] p-5 ring-1 ring-white/10 sm:p-6">
      <Group title="Details">
        <Field label="Name" value={spec.name} onChange={(name) => onChange({ name })} />
        <Field label="Job title" value={spec.title} onChange={(title) => onChange({ title })} />
        <Field label="Email" value={spec.email} onChange={(email) => onChange({ email })} />
        <Field label="Phone" value={spec.phone} onChange={(phone) => onChange({ phone })} />
        <Field label="Website" value={spec.website} onChange={(website) => onChange({ website })} />
        <Field label="Location" value={spec.location} onChange={(location) => onChange({ location })} />
        <Field label="Tagline (front)" value={spec.tagline} onChange={(tagline) => onChange({ tagline })} />
        <Field label="Supporting line (front)" value={spec.descriptor} onChange={(descriptor) => onChange({ descriptor })} />
      </Group>

      <Group title="QR code">
        <Field
          label="Link (website or live demo)"
          value={spec.qrUrl}
          placeholder="https://… — leave empty for a placeholder"
          onChange={(qrUrl) => onChange({ qrUrl })}
        />
      </Group>

      <Group title="Brand">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <Swatch label="Navy" value={spec.navy} onChange={(navy) => onChange({ navy })} />
          <Swatch label="Accent" value={spec.accent} onChange={(accent) => onChange({ accent })} />
          <Swatch label="Back paper" value={spec.paper} onChange={(paper) => onChange({ paper })} />
        </div>
        <label className="block">
          <span className="mb-1 block text-xs text-slate-400">Typography</span>
          <select className={input} value={spec.font} onChange={(e) => onChange({ font: e.target.value as FontKey })}>
            {Object.entries(FONTS).map(([key, f]) => (
              <option key={key} value={key} className="text-black">
                {f.label}
              </option>
            ))}
          </select>
        </label>
      </Group>

      <Group title="Mockup surface">
        <div className="flex gap-2">
          {(Object.keys(BACKGROUNDS) as MockupBg[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onBg(key)}
              aria-pressed={bg === key}
              className={`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                bg === key ? 'border-[#3D7BFF] bg-[#3D7BFF]/15 text-white' : 'border-white/10 text-slate-300 hover:bg-white/5'
              }`}
            >
              {BACKGROUNDS[key].label}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Export">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" disabled={busy !== null} onClick={() => exportPng('front')} className={btn}>
            {busy === 'front' ? 'Rendering…' : 'PNG · Front'}
          </button>
          <button type="button" disabled={busy !== null} onClick={() => exportPng('back')} className={btn}>
            {busy === 'back' ? 'Rendering…' : 'PNG · Back'}
          </button>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full rounded-lg bg-[#3D7BFF] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#5A91FF]"
        >
          Print-ready PDF (91 × 61 mm with bleed)
        </button>
        <p className="text-xs leading-relaxed text-slate-400">
          PNG is the trimmed 85 × 55 mm card at 600 dpi. For the PDF, choose <b>Save as PDF</b> as the destination, paper
          size from the file, margins <b>None</b>, and turn on <b>Background graphics</b>.
        </p>
        {error && <p className="text-xs text-red-300">{error}</p>}
      </Group>

      <button type="button" onClick={onReset} className="text-xs text-slate-400 underline-offset-2 hover:text-white hover:underline">
        Reset to defaults
      </button>

      <details className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-slate-300">
        <summary className="cursor-pointer font-semibold text-white">What is real vs. planned</summary>
        <p className="mt-2 font-semibold text-[#7FA6FF]">Working prototype (manually tested)</p>
        <p>Interactive storefront demo, browser voice assistant, phone test bridge, order and booking flows, manager view.</p>
        <p className="mt-2 font-semibold text-[#FFC76B]">Planned — not live</p>
        <p>In-store translator, multi-tenant phone platform, validated multilingual coverage, paying customers.</p>
        <p className="mt-2 text-slate-400">
          The card shows brand messaging only; it makes no claim of deployed services. Keep it that way when you edit the
          copy.
        </p>
      </details>
    </aside>
  );
}

const btn =
  'rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50';

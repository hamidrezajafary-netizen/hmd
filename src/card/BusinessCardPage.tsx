import { useEffect, useMemo, useState } from 'react';
import { CardMockup } from './CardMockup';
import { EditorPanel } from './EditorPanel';
import { printSheet } from './exporter';
import { DEFAULT_SPEC, loadSpec, saveSpec, type CardSpec, type MockupBg } from './spec';
import type { Side } from './svg';

const PRINT_CSS = `
@page { size: 91mm 61mm; margin: 0; }
.card-print { display: none; }
@media print {
  #card-app { display: none !important; }
  .card-print { display: block !important; }
  html, body { background: #fff !important; margin: 0; }
  .card-print, .card-print * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}`;

const seg = (active: boolean) =>
  `rounded-full px-4 py-1.5 text-sm font-semibold transition ${
    active ? 'bg-white text-[#0B1530]' : 'text-slate-300 hover:text-white'
  }`;

export default function BusinessCardPage() {
  const [spec, setSpec] = useState<CardSpec>(loadSpec);
  const [side, setSide] = useState<Side>(() => (new URLSearchParams(window.location.search).get('side') === 'back' ? 'back' : 'front'));
  const [mode, setMode] = useState<'mockup' | 'print'>('mockup');
  const [bg, setBg] = useState<MockupBg>('desk');

  useEffect(() => {
    const previous = document.title;
    document.title = 'Maison AI — Business Card Studio';
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => saveSpec(spec), [spec]);

  const sheet = useMemo(() => printSheet(spec), [spec]);

  return (
    <>
      <style>{PRINT_CSS}</style>
      <div id="card-app" className="min-h-screen bg-[#060B1A] text-white">
        <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 pb-2 pt-6 sm:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7FA6FF]">Maison AI · Tampere</p>
            <h1 className="text-xl font-extrabold sm:text-2xl">Business Card Studio</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Card side" className="flex rounded-full bg-white/10 p-1">
              <button type="button" className={seg(side === 'front')} aria-pressed={side === 'front'} onClick={() => setSide('front')}>
                Front
              </button>
              <button type="button" className={seg(side === 'back')} aria-pressed={side === 'back'} onClick={() => setSide('back')}>
                Back
              </button>
            </div>
            <div role="group" aria-label="Preview mode" className="flex rounded-full bg-white/10 p-1">
              <button type="button" className={seg(mode === 'mockup')} aria-pressed={mode === 'mockup'} onClick={() => setMode('mockup')}>
                Mockup
              </button>
              <button type="button" className={seg(mode === 'print')} aria-pressed={mode === 'print'} onClick={() => setMode('print')}>
                Print layout
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 pt-4 sm:px-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <CardMockup spec={spec} side={side} mode={mode} bg={bg} />
          <EditorPanel
            spec={spec}
            onChange={(patch) => setSpec((s) => ({ ...s, ...patch }))}
            onReset={() => setSpec(DEFAULT_SPEC)}
            bg={bg}
            onBg={setBg}
          />
        </main>
      </div>
      <div className="card-print" dangerouslySetInnerHTML={{ __html: sheet }} />
    </>
  );
}

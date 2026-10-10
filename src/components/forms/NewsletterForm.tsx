import { useState } from 'react';
import { submitInquiry } from '@/lib/api';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setStatus('sending');
    try {
      await submitInquiry({ type: 'newsletter', email, source: 'footer' });
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-5">
      <label htmlFor="newsletter-email" className="text-[12px] uppercase tracking-[0.24em] text-white/50">
        Market letter
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3.5 text-[13px] text-white placeholder:text-white/35 focus:border-champagne focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="h-11 shrink-0 rounded-lg bg-champagne px-4 text-[13px] font-semibold text-navy-900 transition hover:bg-champagne-400 disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending' : 'Subscribe'}
        </button>
      </div>
      <p aria-live="polite" className="mt-2 min-h-[18px] text-[12px] text-white/55">
        {status === 'done' ? 'Subscribed — our next market letter is on its way.' : null}
        {status === 'error' ? 'That did not send. Please try again.' : null}
        {status === 'idle' ? 'Quarterly insight on prime markets. No more than four emails a year.' : null}
      </p>
    </form>
  );
}

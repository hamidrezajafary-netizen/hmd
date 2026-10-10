import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { submitInquiry, type InquiryType } from '@/lib/api';
import { cx } from '@/lib/cx';
import { Button } from '@/components/ui/Button';

type InquiryFormProps = {
  type: InquiryType;
  propertyName?: string;
  propertySlug?: string;
  source?: string;
  submitLabel?: string;
  className?: string;
  onSent?: () => void;
};

const inputClass =
  'h-12 w-full rounded-lg border border-hairline bg-white px-4 text-[14px] text-navy placeholder:text-muted/70 transition-colors focus:border-navy focus:outline-none';

export function InquiryForm({
  type,
  propertyName,
  propertySlug,
  source,
  submitLabel = 'Send enquiry',
  className,
  onSent,
}: InquiryFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus('sending');
    setError('');

    try {
      await submitInquiry({
        type,
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? ''),
        message: String(data.get('message') ?? ''),
        preferredDate: String(data.get('preferredDate') ?? ''),
        propertyName,
        propertySlug,
        source,
      });
      setStatus('done');
      onSent?.();
    } catch (caught) {
      setStatus('error');
      setError(caught instanceof Error ? caught.message : 'Something went wrong.');
    }
  }

  if (status === 'done') {
    return (
      <div
        className={cx(
          'rounded-xl border border-champagne/40 bg-champagne/5 p-6 text-center',
          className,
        )}
      >
        <CheckCircle2 className="mx-auto h-9 w-9 text-champagne" aria-hidden="true" />
        <h3 className="mt-4 text-[17px] font-bold">Thank you — your enquiry is with us.</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          {type === 'viewing'
            ? 'A senior advisor will confirm your viewing time within one business day.'
            : 'A senior advisor will reply within one business day.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cx('grid gap-4 sm:grid-cols-2', className)}>
      <label className="flex flex-col gap-2 sm:col-span-1">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-muted">Name</span>
        <input name="name" required placeholder="Full name" className={inputClass} />
      </label>

      <label className="flex flex-col gap-2 sm:col-span-1">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-muted">Email</span>
        <input name="email" type="email" required placeholder="you@example.com" className={inputClass} />
      </label>

      <label className="flex flex-col gap-2 sm:col-span-1">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-muted">Phone</span>
        <input name="phone" placeholder="Optional" className={inputClass} />
      </label>

      {type === 'viewing' ? (
        <label className="flex flex-col gap-2 sm:col-span-1">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-muted">
            Preferred date
          </span>
          <input
            name="preferredDate"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            className={inputClass}
          />
        </label>
      ) : null}

      <label className="flex flex-col gap-2 sm:col-span-2">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-muted">
          {type === 'viewing' ? 'Anything we should know?' : 'Message'}
        </span>
        <textarea
          name="message"
          rows={type === 'viewing' ? 3 : 4}
          placeholder={
            propertyName
              ? `I would like to know more about ${propertyName}.`
              : 'Tell us what you are looking for.'
          }
          className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-[14px] leading-relaxed text-navy placeholder:text-muted/70 transition-colors focus:border-navy focus:outline-none"
        />
      </label>

      {error ? (
        <p role="alert" className="text-[13px] text-red-600 sm:col-span-2">
          {error}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={status === 'sending'} className="w-full sm:w-auto">
          {status === 'sending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            submitLabel
          )}
        </Button>
        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          We reply within one business day. Your details are never shared or sold.
        </p>
      </div>
    </form>
  );
}

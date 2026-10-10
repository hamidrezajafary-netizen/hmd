import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { InquiryType } from '@/lib/api';
import { InquiryForm } from '@/components/forms/InquiryForm';

type InquiryModalProps = {
  open: boolean;
  onClose: () => void;
  type: InquiryType;
  title: string;
  description?: string;
  propertyName?: string;
  propertySlug?: string;
};

export function InquiryModal({
  open,
  onClose,
  type,
  title,
  description,
  propertyName,
  propertySlug,
}: InquiryModalProps) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const focusTarget = panel.current?.querySelector<HTMLElement>('input, textarea, button');
    focusTarget?.focus();
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-navy-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close enquiry form"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
        tabIndex={-1}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-title"
        className="animate-panel-in relative z-10 w-full max-w-2xl rounded-t-2xl bg-white p-6 shadow-lift sm:rounded-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="inquiry-title" className="text-[20px] font-bold sm:text-[22px]">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-hairline text-navy transition hover:bg-warm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          <InquiryForm
            key={`${propertySlug ?? 'general'}-${type}`}
            type={type}
            propertyName={propertyName}
            propertySlug={propertySlug}
            source={propertySlug ? `property:${propertySlug}` : 'site'}
            submitLabel={type === 'viewing' ? 'Request viewing' : 'Send enquiry'}
          />
        </div>
      </div>
    </div>
  );
}

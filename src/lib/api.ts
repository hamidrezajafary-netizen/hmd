export type InquiryType = 'contact' | 'viewing' | 'newsletter';

export type InquiryPayload = {
  type: InquiryType;
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  preferredDate?: string;
  propertySlug?: string;
  propertyName?: string;
  source?: string;
};

/**
 * Enquiries are persisted by the small API service that sits behind the dev-server's
 * `/api` proxy (see server/index.js). Keeping the call here means a hosted API could
 * be swapped in without touching the UI.
 */
export async function submitInquiry(payload: InquiryPayload): Promise<void> {
  const response = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.error || 'We could not send that just now.');
  }
}

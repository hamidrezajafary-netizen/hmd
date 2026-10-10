import { useEffect, useRef, useState } from 'react';

import { createBooking } from '../api.js';
import { MAX_NIGHTS, MIN_NIGHTS } from '../constants.js';
import { formatDate, formatPrice, formatStay, nightsLabel, todayIso } from '../format.js';

export default function BookingDrawer({ bed, from, nights, onStayChange, onClose, onBooked }) {
  const [step, setStep] = useState('summary');
  const [form, setForm] = useState({ full_name: '', phone: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);
  const headingRef = useRef(null);

  const total = bed.pricePerNight * nights;

  // Switching to another bed restarts the flow at the summary step.
  useEffect(() => {
    setStep('summary');
    setFieldErrors({});
    setFormError(null);
    headingRef.current?.focus();
  }, [bed.id]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    try {
      const result = await createBooking({
        bed_id: bed.id,
        full_name: form.full_name,
        phone: form.phone,
        check_in: from,
        nights,
      });
      setBooking(result.booking);
      setStep('success');
      await onBooked();
    } catch (error) {
      if (error.fields) {
        setFieldErrors(error.fields);
      } else {
        setFormError(error.message);
      }
      // A clash means the grid is out of date — refresh it.
      if (error.status === 409) await onBooked();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="drawer-layer">
      <div className="drawer-backdrop" onClick={onClose} />

      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        data-step={step}
      >
        <button type="button" className="drawer__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>

        {step === 'summary' && (
          <div className="drawer__pane">
            <p className="drawer__eyebrow">Selected bed</p>
            <h2 id="drawer-title" className="drawer__bed" tabIndex={-1} ref={headingRef}>
              {bed.bedNumber}
            </h2>
            <p className="drawer__room">{bed.roomLabel}</p>

            <dl className="detail-list">
              <div className="detail-list__row">
                <dt>Price</dt>
                <dd>
                  {formatPrice(bed.pricePerNight)} <span className="detail-list__unit">per night</span>
                </dd>
              </div>
              <div className="detail-list__row">
                <dt>Status</dt>
                <dd>
                  <span className={`pill ${bed.isAvailable ? 'pill--available' : 'pill--booked'}`}>
                    {bed.isAvailable ? 'Available' : 'Booked'}
                  </span>
                </dd>
              </div>
              <div className="detail-list__row">
                <dt>Stay</dt>
                <dd>
                  {formatStay(from, nights)}
                  <span className="detail-list__unit">{nightsLabel(nights)}</span>
                </dd>
              </div>
              <div className="detail-list__row detail-list__row--total">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            {!bed.isAvailable && (
              <p className="notice" role="status">
                This bed is already booked for those nights. Change your dates or pick another bed.
              </p>
            )}

            <div className="drawer__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setStep('form')}
                disabled={!bed.isAvailable}
              >
                Book This Bed
              </button>
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                Change selection
              </button>
            </div>
          </div>
        )}

        {step === 'form' && (
          <form className="drawer__pane" onSubmit={handleSubmit} noValidate>
            <p className="drawer__eyebrow">Booking details</p>
            <h2 id="drawer-title" className="drawer__bed drawer__bed--small" tabIndex={-1} ref={headingRef}>
              {bed.bedNumber}
            </h2>
            <p className="drawer__room">{bed.roomLabel}</p>

            <div className="form-fields">
              <label className="field">
                <span className="field__label">Full name</span>
                <input
                  type="text"
                  name="full_name"
                  autoComplete="name"
                  value={form.full_name}
                  aria-invalid={Boolean(fieldErrors.full_name)}
                  aria-describedby={fieldErrors.full_name ? 'err-full-name' : undefined}
                  onChange={(event) => setForm({ ...form, full_name: event.target.value })}
                />
                {fieldErrors.full_name && (
                  <span className="field__error" id="err-full-name">
                    {fieldErrors.full_name}
                  </span>
                )}
              </label>

              <label className="field">
                <span className="field__label">Phone number</span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
                {fieldErrors.phone && (
                  <span className="field__error" id="err-phone">
                    {fieldErrors.phone}
                  </span>
                )}
              </label>

              <div className="field-row">
                <label className="field">
                  <span className="field__label">Booking date</span>
                  <input
                    type="date"
                    name="check_in"
                    value={from}
                    min={todayIso()}
                    aria-invalid={Boolean(fieldErrors.check_in)}
                    onChange={(event) => onStayChange({ from: event.target.value })}
                  />
                  {fieldErrors.check_in && <span className="field__error">{fieldErrors.check_in}</span>}
                </label>

                <label className="field">
                  <span className="field__label">Nights</span>
                  <input
                    type="number"
                    name="nights"
                    min={MIN_NIGHTS}
                    max={MAX_NIGHTS}
                    value={nights}
                    aria-invalid={Boolean(fieldErrors.nights)}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      if (Number.isFinite(next)) {
                        onStayChange({
                          nights: Math.min(MAX_NIGHTS, Math.max(MIN_NIGHTS, Math.trunc(next))),
                        });
                      }
                    }}
                  />
                  {fieldErrors.nights && <span className="field__error">{fieldErrors.nights}</span>}
                </label>
              </div>
            </div>

            <div className="form-summary">
              <span>{bed.bedNumber}</span>
              <span>
                {nightsLabel(nights)} × {formatPrice(bed.pricePerNight)}
              </span>
              <strong>Total {formatPrice(total)}</strong>
            </div>

            {formError && (
              <p className="notice" role="alert">
                {formError}
              </p>
            )}

            <div className="drawer__actions">
              <button type="submit" className="btn btn--primary" disabled={submitting || !bed.isAvailable}>
                {submitting ? 'Confirming…' : 'Confirm Booking'}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setStep('summary')}>
                Back
              </button>
            </div>
          </form>
        )}

        {step === 'success' && booking && (
          <div className="drawer__pane" role="status">
            <p className="drawer__eyebrow">Booking confirmed</p>
            <h2 id="drawer-title" className="receipt__reference" tabIndex={-1} ref={headingRef}>
              {booking.reference}
            </h2>
            <p className="drawer__room">Keep this reference for your records.</p>

            <dl className="detail-list">
              <div className="detail-list__row">
                <dt>Bed</dt>
                <dd>{booking.bedNumber}</dd>
              </div>
              <div className="detail-list__row">
                <dt>Name</dt>
                <dd>{booking.fullName}</dd>
              </div>
              <div className="detail-list__row">
                <dt>Booking date</dt>
                <dd>{formatDate(booking.checkIn)}</dd>
              </div>
              <div className="detail-list__row">
                <dt>Nights</dt>
                <dd>{nightsLabel(booking.nights)}</dd>
              </div>
              <div className="detail-list__row detail-list__row--total">
                <dt>Total price</dt>
                <dd>{formatPrice(booking.totalPrice)}</dd>
              </div>
            </dl>

            <div className="drawer__actions">
              <button type="button" className="btn btn--primary" onClick={onClose}>
                Book another bed
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

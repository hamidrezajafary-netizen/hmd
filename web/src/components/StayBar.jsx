import { MAX_NIGHTS, MIN_NIGHTS } from '../constants.js';
import { formatStay, todayIso } from '../format.js';

export default function StayBar({ from, nights, onChange }) {
  const shiftNights = (delta) => {
    const next = Math.min(MAX_NIGHTS, Math.max(MIN_NIGHTS, nights + delta));
    onChange({ nights: next });
  };

  return (
    <section className="stay-bar" aria-label="Stay dates">
      <p className="stay-bar__summary">
        <span className="stay-bar__label">Showing availability for</span>
        <strong>{formatStay(from, nights)}</strong>
      </p>

      <div className="stay-bar__controls">
        <label className="field field--inline">
          <span className="field__label">Check-in</span>
          <input
            type="date"
            value={from}
            min={todayIso()}
            onChange={(event) => onChange({ from: event.target.value })}
          />
        </label>

        <div className="field field--inline">
          <span className="field__label" id="nights-label">
            Nights
          </span>
          <div className="stepper" role="group" aria-labelledby="nights-label">
            <button
              type="button"
              className="stepper__button"
              onClick={() => shiftNights(-1)}
              disabled={nights <= MIN_NIGHTS}
              aria-label="One night fewer"
            >
              −
            </button>
            <input
              type="number"
              className="stepper__input"
              value={nights}
              min={MIN_NIGHTS}
              max={MAX_NIGHTS}
              aria-label="Number of nights"
              onChange={(event) => {
                const next = Number(event.target.value);
                if (Number.isFinite(next)) {
                  onChange({
                    nights: Math.min(MAX_NIGHTS, Math.max(MIN_NIGHTS, Math.trunc(next))),
                  });
                }
              }}
            />
            <button
              type="button"
              className="stepper__button"
              onClick={() => shiftNights(1)}
              disabled={nights >= MAX_NIGHTS}
              aria-label="One night more"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

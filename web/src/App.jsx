import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchBeds } from './api.js';
import { todayIso } from './format.js';
import BedGrid from './components/BedGrid.jsx';
import BookingDrawer from './components/BookingDrawer.jsx';
import Legend from './components/Legend.jsx';
import StayBar from './components/StayBar.jsx';

export default function App() {
  const [from, setFrom] = useState(todayIso);
  const [nights, setNights] = useState(1);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [condensed, setCondensed] = useState(false);

  const loadBeds = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchBeds(from, nights);
      setBeds(data.beds);
    } catch (error) {
      setLoadError(error.message);
      setBeds([]);
    } finally {
      setLoading(false);
    }
  }, [from, nights]);

  useEffect(() => {
    loadBeds();
  }, [loadBeds]);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const selectedBed = useMemo(
    () => beds.find((bed) => bed.id === selectedId) ?? null,
    [beds, selectedId],
  );

  // If the selected bed disappears from the list, drop the selection.
  useEffect(() => {
    if (selectedId !== null && !loading && !loadError && !selectedBed) {
      setSelectedId(null);
    }
  }, [loading, loadError, selectedBed, selectedId]);

  const updateStay = useCallback((patch) => {
    if (patch.from) setFrom(patch.from);
    if (patch.nights) setNights(patch.nights);
  }, []);

  const availableCount = beds.filter((bed) => bed.isAvailable).length;

  return (
    <div className={`app${condensed ? ' is-condensed' : ''}`}>
      <a className="skip-link" href="#beds">
        Skip to beds
      </a>

      <header className="app-header">
        <div className="app-header__inner">
          <p className="app-brand">Bed &amp; Breakfast</p>
          <h1 className="app-title">Choose Your Bed</h1>
          <p className="app-subtitle">
            Pick any green bed to see its price, then book it in a few clicks.
          </p>
        </div>
      </header>

      <main className="app-main">
        <StayBar from={from} nights={nights} onChange={updateStay} />

        <section className="grid-section" id="beds" aria-labelledby="grid-heading">
          <div className="grid-section__head">
            <h2 id="grid-heading" className="grid-section__heading">
              {loading ? 'Checking availability…' : `${availableCount} of ${beds.length} beds available`}
            </h2>
            <Legend />
          </div>

          {loadError && (
            <p className="notice" role="alert">
              We could not load the beds. {loadError}
            </p>
          )}

          <BedGrid
            beds={beds}
            loading={loading}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>
      </main>

      <footer className="app-footer">
        <div className="app-footer__inner">
          <p className="app-footer__note">
            All prices are per bed, per night. Bookings are confirmed instantly.
          </p>
          <Legend />
        </div>
      </footer>

      {selectedBed && (
        <BookingDrawer
          bed={selectedBed}
          from={from}
          nights={nights}
          onStayChange={updateStay}
          onClose={() => setSelectedId(null)}
          onBooked={loadBeds}
        />
      )}
    </div>
  );
}

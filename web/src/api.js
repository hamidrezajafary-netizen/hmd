async function toResult(response) {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error((payload && payload.error) || 'Something went wrong.');
    error.status = response.status;
    error.fields = (payload && payload.fields) || null;
    throw error;
  }

  return payload;
}

export async function fetchBeds(from, nights) {
  const params = new URLSearchParams({ from, nights: String(nights) });
  return toResult(await fetch(`/api/beds?${params.toString()}`));
}

export async function createBooking(body) {
  return toResult(
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  );
}

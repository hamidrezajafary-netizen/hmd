import { randomInt } from 'node:crypto';

import { pool, query } from './db.js';

const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function newReference() {
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)];
  }
  return `BK-${code}`;
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export class ValidationError extends Error {
  constructor(fields) {
    super('Validation failed');
    this.fields = fields;
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
  }
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * Bed list with availability for the requested stay window.
 * A bed is unavailable when any booking overlaps [from, from + nights).
 */
export async function listBeds(from, nights) {
  const { rows } = await query(
    `SELECT b.id,
            b.bed_number,
            b.room_label,
            b.price_per_night,
            EXISTS (
              SELECT 1
              FROM bookings bk
              WHERE bk.bed_id = b.id
                AND bk.check_in < ($1::date + ($2::int * INTERVAL '1 day'))
                AND (bk.check_in + (bk.nights * INTERVAL '1 day')) > $1::date
            ) AS is_booked
     FROM beds b
     WHERE b.is_active
     ORDER BY b.bed_number`,
    [from, nights],
  );

  return rows.map((row) => ({
    id: row.id,
    bedNumber: row.bed_number,
    roomLabel: row.room_label,
    pricePerNight: Number(row.price_per_night),
    isAvailable: !row.is_booked,
  }));
}

function validateBookingPayload(payload) {
  const fields = {};
  const fullName = typeof payload.full_name === 'string' ? payload.full_name.trim() : '';
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
  const checkIn = payload.check_in;
  const nights = Number(payload.nights);

  if (fullName.length < 2) {
    fields.full_name = 'Please enter your full name.';
  }

  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) {
    fields.phone = 'Please enter a valid phone number.';
  }

  if (!isIsoDate(checkIn)) {
    fields.check_in = 'Please choose a booking date.';
  } else if (checkIn < todayIso()) {
    fields.check_in = 'The booking date cannot be in the past.';
  }

  if (!Number.isInteger(nights) || nights < 1 || nights > 60) {
    fields.nights = 'Number of nights must be a whole number between 1 and 60.';
  }

  if (Object.keys(fields).length > 0) {
    throw new ValidationError(fields);
  }

  return { fullName, phone, checkIn, nights };
}

/**
 * Creates a booking. The bed row is locked for the duration of the transaction,
 * so two simultaneous requests can never book overlapping dates.
 */
export async function createBooking(payload) {
  const { fullName, phone, checkIn, nights } = validateBookingPayload(payload);
  const bedId = Number(payload.bed_id);

  if (!Number.isInteger(bedId) || bedId <= 0) {
    throw new ValidationError({ bed_id: 'Please choose a bed.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const bedResult = await client.query(
      'SELECT id, bed_number, price_per_night FROM beds WHERE id = $1 AND is_active FOR UPDATE',
      [bedId],
    );

    if (bedResult.rowCount === 0) {
      throw new NotFoundError('That bed is no longer available.');
    }

    const bed = bedResult.rows[0];

    const overlap = await client.query(
      `SELECT 1
       FROM bookings
       WHERE bed_id = $1
         AND check_in < ($2::date + ($3::int * INTERVAL '1 day'))
         AND (check_in + (nights * INTERVAL '1 day')) > $2::date
       LIMIT 1`,
      [bedId, checkIn, nights],
    );

    if (overlap.rowCount > 0) {
      throw new ConflictError('That bed is already booked for one of those nights.');
    }

    const totalPrice = Number(bed.price_per_night) * nights;

    let booking = null;
    for (let attempt = 0; attempt < 5 && !booking; attempt += 1) {
      const reference = newReference();
      try {
        const inserted = await client.query(
          `INSERT INTO bookings (reference, bed_id, full_name, phone, check_in, nights, total_price)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, reference, check_in, nights, total_price`,
          [reference, bedId, fullName, phone, checkIn, nights, totalPrice],
        );
        booking = inserted.rows[0];
      } catch (error) {
        if (error.code !== '23505') throw error;
      }
    }

    if (!booking) {
      throw new ConflictError('Could not create a booking reference. Please try again.');
    }

    await client.query('COMMIT');

    return {
      reference: booking.reference,
      bedId,
      bedNumber: bed.bed_number,
      fullName,
      phone,
      checkIn: booking.check_in.toISOString().slice(0, 10),
      checkOut: addDays(booking.check_in.toISOString().slice(0, 10), nights),
      nights,
      pricePerNight: Number(bed.price_per_night),
      totalPrice: Number(booking.total_price),
    };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

export function parseStay(query) {
  const from = isIsoDate(query.from) ? query.from : todayIso();
  const nights = Number(query.nights);
  return {
    from,
    nights: Number.isInteger(nights) && nights >= 1 && nights <= 60 ? nights : 1,
  };
}

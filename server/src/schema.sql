-- Bed booking schema. Safe to run repeatedly.

CREATE TABLE IF NOT EXISTS beds (
  id              SERIAL PRIMARY KEY,
  bed_number      TEXT NOT NULL UNIQUE,
  room_label      TEXT NOT NULL,
  price_per_night NUMERIC(10, 2) NOT NULL CHECK (price_per_night > 0),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bookings (
  id          SERIAL PRIMARY KEY,
  reference   TEXT NOT NULL UNIQUE,
  bed_id      INTEGER NOT NULL REFERENCES beds (id) ON DELETE RESTRICT,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL,
  check_in    DATE NOT NULL,
  nights      INTEGER NOT NULL CHECK (nights BETWEEN 1 AND 60),
  total_price NUMERIC(10, 2) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_bed_check_in_idx ON bookings (bed_id, check_in);

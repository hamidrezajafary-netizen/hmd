import express from 'express';

import {
  ConflictError,
  NotFoundError,
  ValidationError,
  createBooking,
  listBeds,
  parseStay,
} from './bookingService.js';
import { waitForDatabase } from './db.js';

const app = express();
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/beds', async (req, res, next) => {
  try {
    const { from, nights } = parseStay(req.query);
    const beds = await listBeds(from, nights);
    res.json({ from, nights, beds });
  } catch (error) {
    next(error);
  }
});

app.post('/api/bookings', async (req, res, next) => {
  try {
    const booking = await createBooking(req.body ?? {});
    res.status(201).json({ booking });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message, fields: error.fields });
  }
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }
  if (error instanceof ConflictError) {
    return res.status(409).json({ error: error.message });
  }
  if (error instanceof SyntaxError) {
    return res.status(400).json({ error: 'Invalid request body.' });
  }
  console.error(error);
  return res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

const port = Number(process.env.PORT || 4000);

waitForDatabase()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Bed booking API listening on http://0.0.0.0:${port}`);
    });
  })
  .catch((error) => {
    console.error('Could not reach the database:', error.message);
    process.exit(1);
  });

import express from 'express';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const app = express();
const PORT = Number(process.env.PORT || 8000);
const DATA_DIR = process.env.DATA_DIR || '/app/data';
const FILE = path.join(DATA_DIR, 'inquiries.json');

const TYPES = new Set(['contact', 'viewing', 'newsletter']);

app.use(express.json({ limit: '64kb' }));

function clean(value, max = 2000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

async function readAll() {
  try {
    const parsed = JSON.parse(await readFile(FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(rows) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE, JSON.stringify(rows, null, 2));
}

// Writes are serialised so two enquiries arriving together cannot clobber each other.
let queue = Promise.resolve();

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'horizon-api' });
});

app.post('/api/inquiries', async (req, res) => {
  const body = req.body ?? {};
  const type = clean(body.type, 32) || 'contact';
  const email = clean(body.email, 320);

  if (!TYPES.has(type)) {
    return res.status(400).json({ error: 'Unknown enquiry type.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (type !== 'newsletter' && clean(body.name, 120).length < 2) {
    return res.status(400).json({ error: 'Please tell us your name.' });
  }

  const record = {
    id: `ENQ-${Date.now().toString(36).toUpperCase()}`,
    type,
    name: clean(body.name, 120),
    email,
    phone: clean(body.phone, 60),
    message: clean(body.message),
    preferredDate: clean(body.preferredDate, 40),
    propertySlug: clean(body.propertySlug, 120),
    propertyName: clean(body.propertyName, 160),
    source: clean(body.source, 120),
    createdAt: new Date().toISOString(),
  };

  queue = queue.then(async () => {
    const rows = await readAll();
    rows.push(record);
    await writeAll(rows);
  });
  await queue;

  console.log(
    `[inquiry] ${record.type} from ${record.email}${record.propertySlug ? ` re ${record.propertySlug}` : ''}`,
  );
  res.status(201).json({ id: record.id, received: true });
});

// Read-back endpoint so the stored enquiries can be inspected without database access.
app.get('/api/inquiries', async (_req, res) => {
  const rows = await readAll();
  res.json({ count: rows.length, inquiries: rows.slice(-50).reverse() });
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Horizon API listening on http://0.0.0.0:${PORT}`);
});

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { pool, query, waitForDatabase } from './db.js';
import { SAMPLE_BEDS } from './beds.js';

const here = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  await waitForDatabase();

  const schema = await readFile(join(here, 'schema.sql'), 'utf8');
  await query(schema);

  for (const bed of SAMPLE_BEDS) {
    await query(
      `INSERT INTO beds (bed_number, room_label, price_per_night)
       VALUES ($1, $2, $3)
       ON CONFLICT (bed_number)
       DO UPDATE SET room_label = EXCLUDED.room_label,
                     price_per_night = EXCLUDED.price_per_night,
                     is_active = TRUE`,
      [bed.bedNumber, bed.roomLabel, bed.pricePerNight],
    );
  }

  console.log(`Schema ready. ${SAMPLE_BEDS.length} beds seeded.`);
}

migrate()
  .then(() => pool.end())
  .catch(async (error) => {
    console.error('Migration failed:', error.message);
    await pool.end();
    process.exit(1);
  });

import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export function query(text, params) {
  return pool.query(text, params);
}

/**
 * The API container can start before Postgres is ready to accept connections.
 * Retry briefly instead of crashing on the first refused connection.
 */
export async function waitForDatabase(retries = 30, delayMs = 1000) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

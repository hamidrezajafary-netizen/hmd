# AGENTS.md

Bed booking site: pick an available bed, see its price, book it.
No external services and no secrets — everything runs locally in Compose.

## Stack

- `web/` — React + Vite single page (`Choose Your Bed`), plain CSS in `web/src/styles.css`.
- `server/` — Express JSON API, PostgreSQL via `pg`. No ORM, raw SQL in `server/src/schema.sql`.
- `docker-compose.base44.yml` — the runbook. `docker compose -f docker-compose.base44.yml up -d --build`.

## Things worth knowing

- **Single origin.** Only host port 3000 is published. Vite proxies `/api` to the `api`
  service (`http://api:4000`), so there is no CORS setup and the browser never talks to 4000.
  Keep it that way unless something genuinely needs its own origin.
- **Dependencies are installed at container start**, not baked into an image, so source edits
  are live. `migrate` is the only service that installs server dependencies; `api` waits for
  it (`service_completed_successfully`) and never installs itself. To add an API dependency:
  `docker compose -f docker-compose.base44.yml exec api npm install <pkg>`, then
  `docker compose -f docker-compose.base44.yml restart api`.
- **Watchers:** `node --watch` for the API, Vite with `watch.usePolling` for the web service
  (bind mounts do not always emit inotify events). Vite changes hot-reload; API changes restart
  the process, so no container restart is needed.
- **Sample bed inventory lives in `server/src/beds.js`** — bed numbers, dorm labels and prices.
  Edit it and re-run `docker compose -f docker-compose.base44.yml run --rm migrate` to apply.
- **Availability is date-range based.** A bed is shown as booked when any booking overlaps
  `[check_in, check_in + nights)`. Double bookings are prevented in
  `createBooking()` by locking the bed row (`SELECT ... FOR UPDATE`) inside a transaction and
  re-checking for overlaps before insert. Do not move that check out of the transaction.
- **Sandbox-only override:** when `BASE44_PREVIEW_MODE` is exactly `"1"`, `web/vite.config.js`
  appends the sandbox host wildcard and the public preview origin to Vite's `allowedHosts`,
  because the preview proxy connects through a hostname that changes on every re-import.
  With the variable unset the config is the Vite default. Nothing else is gated on the flag.
- The date inputs use the browser's date picker; `check_in` is validated server-side against
  the server's UTC "today", so a date in the past is rejected even if the browser allows it.

## Verify it works

```bash
curl -s http://localhost:3000/api/health                 # {"status":"ok"}
curl -s "http://localhost:3000/api/beds?from=2026-10-10&nights=1"
curl -s -X POST http://localhost:3000/api/bookings \
  -H 'Content-Type: application/json' \
  -d '{"bed_id":1,"full_name":"Test User","phone":"5551234567","check_in":"2026-10-10","nights":2}'
```

Then load http://localhost:3000/, click an available bed, and complete the drawer form.
A completed booking must survive a page refresh (it is in Postgres, not component state).

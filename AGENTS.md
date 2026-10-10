# Horizon Properties — working notes

Premium real estate marketing site: Vite + React + TypeScript + Tailwind, with a small Express
service behind `/api` for enquiries.

## Running it here

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

* Web (Vite dev server, live reload): <http://localhost:3000>
* API (Express + JSON store): <http://localhost:8000/api/health>
* Frontend type-check / production build: `docker compose -f docker-compose.base44.yml exec web npm run build`

The dev server binds `0.0.0.0:5173`, mapped to host port **3000**. The browser only ever talks to
port 3000; [`vite.config.ts`](vite.config.ts) proxies `/api` to the `api` service, so cookies and
origins stay single-origin.

## Non-obvious things worth knowing

* **Dependencies live in named volumes** (`web_node_modules`, `api_node_modules`) because the repo is
  bind-mounted. `docker compose ... up` reinstalls on start, so a dependency change needs only a
  restart of that service — no rebuild and no deleting data volumes.
* **Imagery** is served from Unsplash's CDN (`src/lib/images.ts` builds the URLs with width params and
  a `srcset`). Every photo id in the repo was verified to return HTTP 200; if you swap one, check it
  first — a wrong id renders a warm-grey placeholder instead of a photo.
* **The `/api` service is not a database.** Enquiries (contact, viewing request, newsletter) are
  appended to `inquiries.json` in the `api_data` volume, so they survive restarts. Read them back at
  `GET /api/inquiries`. The API validates type/email/name and serialises writes.
* **Saved properties are per-visitor** (`localStorage`, key `horizon:favorites`) — no account needed,
  and the "Saved only" toggle on `/properties` reads the same store.
* **`BASE44_PREVIEW_MODE`** gates sandbox-only dev-server tweaks in `vite.config.ts` (host allowlist
  for `.$BASE44_SANDBOX_HOST_DOMAIN`, and `wss` HMR on port 443 for the https preview). Unset or any
  other value keeps stock Vite behaviour — nothing else in the app reads the flag.
* **Property data** lives in `src/data/properties.ts` and mirrors a database row (id/slug/price/beds/
  baths/sqft/agentId/images). Swapping it for an API response means changing that one module.

## Verifying the site

1. `curl -sI http://localhost:3000/` returns `200`.
2. Home page renders hero, Who We Are, Featured carousel, Services, Why Horizon, Team, CTA, Footer.
3. Carousel: arrows, keyboard (focus the rail, ←/→) and mouse drag all scroll the rail; wrap-around at
   either end.
4. `/properties` — search and the six selects filter the grid, and the state is written to the URL
   (shareable). Saved-only reads localStorage favourites.
5. `/properties/lakeside-modern-villa` — thumbnail switching, full-screen viewer (Esc / ← / →),
   Contact Agent and Schedule a Viewing both POST to `/api/inquiries`; verify with
   `curl -s http://localhost:8000/api/inquiries`.
6. Every page has a footer newsletter form that also posts to `/api/inquiries` (`type=newsletter`).

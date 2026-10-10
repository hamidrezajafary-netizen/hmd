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
* **The home hero is scroll-scrubbed, never played.** `HeroScroll` pins a `100svh` stage inside a
  `300svh` runway (260svh on phones) and maps scroll progress straight onto `video.currentTime` —
  0% scroll → frame 0, 100% → last frame. `useScrollVideoScrub` is the whole engine: passive
  scroll/resize listeners only cache the target progress, one `requestAnimationFrame` loop eases
  toward it and seeks, and the copy fade is written through refs — so scrolling never re-renders
  React or reads layout. Nothing calls `play()`; the element carries no `autoplay`/`loop`. The
  tuning dials (smoothing, seek epsilon, copy fade) sit at the top of that hook.
* **The hero clip is re-encoded on purpose.** `public/media/hero-scrub.mp4` (H.264, keyframe every
  6 frames = 0.25s, no audio, `+faststart`) is what makes seeking smooth; the repo-root
  `ویدیو هیروسکشن.mp4` is the untouched master, and its single keyframe for all 217 frames made
  scrubbing stutter badly. To replace the footage:
  `ffmpeg -i master.mp4 -an -c:v libx264 -preset slower -crf 24 -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart public/media/hero-scrub.mp4`
  plus the poster (`-vf "select=eq(n\,0)" -frames:v 1 -q:v 4 public/media/hero-poster.jpg`).
  Swapping those two files needs no code change — see `src/components/sections/heroMedia.ts`.
* **Hero degradation paths.** Reduced motion (`prefers-reduced-motion`) and a video that fails to
  load both fall back to `HeroStatic`, the original photographic hero, instead of the pinned
  runway. Until the clip can be scrubbed (readyState ≥ 2) the stage shows the poster, keeps the
  copy fully opaque and never scroll-locks the page.

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
7. Hero scrub: at the top of the page the hero shows frame 0 with the video `paused` (no
   `autoplay`/`loop` attributes). Scrolling to 25/50/75/100% of the runway
   (`section.offsetHeight - stage.offsetHeight` past the section's offset top) must land
   `video.currentTime` on 0.25/0.5/0.75/1.0 of its ~9.04s duration, and scrolling back up must
   walk the timeline backwards while `video.currentTime` never advances on its own.

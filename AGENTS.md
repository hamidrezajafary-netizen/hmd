# Burger King scroll experience — working notes

One full-viewport video stage, scrubbed by scroll: the visitor walks in, reaches the display case,
and four glass "shelf tag" hotspots fade in over it. Vite + React + TypeScript + Tailwind, no
backend, nothing persisted.

## Running it here

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

* Web (Vite dev server, live reload): <http://localhost:3000> — the container serves 5173, mapped to
  host port **3000**. That is the only public port.
* Type-check / production build: `docker compose -f docker-compose.base44.yml exec web npm run build`

One service. Dependencies live in the named volume `web_node_modules` (the repo is bind-mounted), so
`up` reinstalls on start; a dependency change needs only a restart of `web` — never delete a volume
to refresh dependencies.

## ⚠️ The bundled clip is NOT a burger restaurant — re-shoot or re-supply before shipping

`assets/burger-master.mp4` (+ the 10 MB `ویدیو هیروسکشن.mp4` it was copied from) renders as a
**real-estate walkthrough**: a villa exterior with a pool at dusk, moving into a living room and
kitchen. There is **no display case and no burgers anywhere in it.**

How that was established — worth repeating rather than trusting this note: the `<video>` element on
the running page reports the exact intrinsic size and duration of this re-encoded master
(1168x768 / 9.042s), and screenshots of the page at 0%, ~67% and 100% of the runway all show that
interior. (A grey-scale SSIM cross-check against the repo's real-estate references was **not**
decisive — 0.36 vs 0.40 for an unrelated burger clip — so do not cite image-diff scores as proof
either way; look at the frames.)

The burger data in `src/data/menu.ts` is a different project's concept, so:

* the four `MENU[].anchor` values are **placeholders on an even left-to-right spread**, not real
  product positions;
* the mechanic itself (scrub, reveal, hover, order dialog, basket) is complete and verified, so
  swapping the footage is the only work left.

**To swap the footage:** replace `assets/burger-master.mp4`, re-run the re-encode below, then re-tune
the anchors with `tools/anchor-grid.html` (that file documents the two commands + the grid). The
master needs its keyframe layout re-checked with `ffprobe` — a single-keyframe master scrubs badly.

## Non-obvious things worth knowing

* **The clip is re-encoded on purpose — don't drop the camera original in.**
  `assets/burger-master.mp4` (9.04s, 217 frames @ 24fps, 1168x768) carries a **single keyframe for
  the whole clip**, so every seek decoded from frame 0 and scrubbing stuttered. The shipped
  `public/media/burger-scrub.mp4` is that master re-encoded with `-g 4 -keyint_min 4 -sc_threshold 0
  -bf 0` (a keyframe every 4 frames — 54 of them) plus `+faststart` and no audio, so any seek decodes
  at most 3 frames. The exact commands and the poster extraction sit at the top of
  [`src/data/media.ts`](src/data/media.ts).
* **Scrubbing is the experience, and the clip never plays.** [`useScrollScrub`](src/hooks/useScrollScrub.ts)
  is the whole engine: passive scroll/resize listeners only cache the *target* progress and wake a
  single `requestAnimationFrame` loop; the loop eases the displayed progress toward it and writes
  `video.currentTime` only when the wanted time moved more than ~a frame. There is no `play()`, no
  `autoplay`, no `loop`, no `controls`, and `video.paused` stays `true` for the life of the page. The
  tuning dials are the constants at the top of that hook.
* **Nothing scroll-related may enter React state.** The hook hands progress to `BurgerStage` through
  a callback, and the stage paints cue opacity, the bottom scrim and the reveal attribute straight
  onto refs — so scrolling causes zero re-renders and zero extra layout reads. The single exception
  is `revealed`, which flips at most twice per pass (`REVEAL_IN`/`REVEAL_OUT` hysteresis in the same
  hook). Putting progress into state reintroduces jank.
* **Hotspot anchors are in *video* space, not viewport space.** The stage renders the clip with
  `object-fit: cover`, which crops a different amount at every aspect ratio; `HotspotOverlay`
  therefore measures the stage and sets the overlay's box to exactly the cover box (via
  `ResizeObserver` + `STAGE_VIDEO_SIZE`), so a card anchored at 15% of the frame stays over whatever
  is 15% of the way across the footage on any window. Switching those to viewport percentages breaks
  alignment the moment the window changes shape. Keep the anchors' pointer dot on the product and
  let the card hang below it.
* **Runway geometry**: the runway is `400vh` with a `100vh` sticky stage pinned inside it (plain
  `vh`, per the brief), so the scrub distance is runway minus one viewport —
  `measureRunway()` in [`src/lib/scrub.ts`](src/lib/scrub.ts) is the single source of truth for both
  the hook and any future deep-linking.
* **Below `md` the tags dock into a 2x2 grid** instead of being pinned to the frame: `object-fit:
  cover` on a portrait phone crops away the outer burgers entirely, so per-burger anchoring would
  point at nothing. Both layouts live in `HotspotOverlay` and share `HotspotCard`.
* **The reveal is driven by an attribute, not by state per card.** The stage flips `data-reveal` and
  `src/index.css` staggers `.hotspot` from a frozen resting state using each card's `--i`.
* **`BASE44_PREVIEW_MODE`** gates sandbox-only dev-server tweaks in [`vite.config.ts`](vite.config.ts)
  (host allowlist for `.$BASE44_SANDBOX_HOST_DOMAIN`, `wss` HMR on port 443 for the https preview).
  Unset or any other value keeps stock Vite behaviour; nothing in the app reads the flag.
* **The basket is client-side only** — React state in [`src/hooks/useCart.ts`](src/hooks/useCart.ts).
  A reload starts a fresh order and nothing is charged. A real order backend would be greenfield.
* **All copy lives in [`src/data/menu.ts`](src/data/menu.ts)** (four burgers, prices, descriptions,
  anchors). `public/media/*` is served with HTTP range support by the Vite dev server, which is what
  lets the browser seek without downloading the whole file first — if the media ever moves behind a
  custom server, keep byte ranges working.

## How to verify a change here

1. `curl -sI http://localhost:3000/` answers, then load the page.
2. Scroll to `runwayTop + 0.5 * span` (`measureRunway()`) and check `video.currentTime` settles at
   about `duration / 2`; scroll back up and it must go **down**; stop scrolling and it must freeze
   (`paused === true`, no drift).
3. The cue ("Scroll down to enter") is at opacity 1 at the top and 0 by ~7% of the runway.
4. At the very end of the page `#stage-viewport[data-reveal]` is `on`, four `.hotspot` cards have a
   non-zero box, and the cue is invisible.
5. Click a card: the dialog shows the name, description, price, a working [-] qty [+] stepper, and an
   "Add to Order — $<total>" button; adding closes it, updates `Cart (n)`, and shows the toast. The
   basket opens, lists the line, and removing it falls back to the empty state.
6. Narrow the viewport: the tags dock into the 2x2 grid, the dialog and basket become bottom sheets,
   and `document.documentElement.scrollWidth` stays within the client width.

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

## The clip and the anchors

`assets/burger-master.mp4` (8.0s, 192 frames @ 24fps, 864x480 + an AAC track nobody plays) is the
first-person walk-in that ends on the display case of four burgers. The four `MENU[].anchor` values
in [`src/data/menu.ts`](src/data/menu.ts) were **measured off that last frame**, not guessed: the
burgers sit in a band about 40–66% down the frame, with clusters centred near 12.5 / 36 / 60.5 / 85%
across (the case itself sits slightly left of centre). Re-measure with
[`tools/anchor-grid.html`](tools/anchor-grid.html) whenever the footage changes — that file documents
the two commands and the percentage grid. The dot marks the burger; the card hangs below it.

## Non-obvious things worth knowing

* **The clip is re-encoded on purpose — don't drop the camera original in.**
  `assets/burger-master.mp4` carries a **single keyframe for the whole clip**, so every seek decoded
  from frame 0 and scrubbing stuttered. The shipped `public/media/burger-scrub.mp4` is that master
  re-encoded with `-g 4 -keyint_min 4 -sc_threshold 0 -bf 0` (a keyframe every 4 frames — 47 of
  them), `-an`, `+faststart`, at `-crf 19`, so any seek decodes at most 3 frames. The exact commands
  and the poster extraction sit at the top of [`src/data/media.ts`](src/data/media.ts).
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
  `ResizeObserver` + `STAGE_VIDEO_SIZE`), so a card anchored at 12.5% of the frame stays over the
  burger that is 12.5% of the way across the footage on any window. Switching those to viewport
  percentages breaks alignment the moment the window changes shape.
* **The layout is chosen by *aspect ratio*, not by width — that matters here.** `object-fit: cover`
  only ever shows `stageAspect / videoAspect` of a height-limited frame, and the clip is 1.8. A
  portrait tablet (0.75) therefore shows just **42%** of the case's width: the outer burgers are
  cropped away, so a width-only breakpoint (`md:`) left two tags pointing at nothing and two hanging
  off-screen. `MIN_MAPPED_ASPECT` (1.58) in `HotspotOverlay` picks the per-burger layout when the
  stage is landscape enough, and docks the four tags into a row (`grid-cols-2 sm:grid-cols-4`) when
  it is not. Keep that decision on the measured stage, not on a media query.
* **Known trade-off at the mapped threshold**: the tags are fixed-px cards, so in a window sitting
  just above `MIN_MAPPED_ASPECT` (e.g. 1280x800) the outermost card is trimmed ~12px on its left
  edge — the dot stays exactly on its burger. Raise `MIN_MAPPED_ASPECT` to hide that at the cost of
  docking the row in more windows, or nudge the first anchor right to favour the card over the dot.
* **Runway geometry**: the runway is `400vh` with a `100vh` sticky stage pinned inside it (plain
  `vh`, per the brief), so the scrub distance is runway minus one viewport — `measureRunway()` in
  [`src/lib/scrub.ts`](src/lib/scrub.ts) is the single source of truth for both the hook and any
  future deep-linking. Note it measures the live DOM: a script that scrolls to a fraction of the
  runway must recompute it after changing the viewport size, or it will scroll to the wrong frame.
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
* The two Persian-named uploads at the repo root (`ویدیو هیروسکشن.mp4` and the prompt `.txt` files)
  are leftovers from the original import: the root `.mp4` is an unrelated real-estate walkthrough and
  nothing in the app reads any of them.

## How to verify a change here

1. `curl -sI http://localhost:3000/` answers, then load the page.
2. Scroll to `runwayTop + 0.5 * span` (`measureRunway()`) and check `video.currentTime` settles at
   about `duration / 2` (4.0s for this 8s clip); scroll back up and it must go **down**; stop
   scrolling and it must freeze (`paused === true`, no drift).
3. The cue ("Scroll down to enter") is at opacity 1 at the top and 0 by ~7% of the runway.
4. At the very end of the page `#stage-viewport[data-reveal]` is `on`, and four `.hotspot` cards have
   a non-zero box: a horizontal row over the case at ≥1.58 stage aspect, a docked row otherwise.
5. Click a card: the dialog shows the name, description, price, a working [-] qty [+] stepper, and an
   "Add to Order — $<total>" button; adding closes it, updates `Cart (n)`, and shows the toast. The
   basket opens, lists the line, and removing it falls back to the empty state.
6. Narrow the viewport: the tags dock into the row, the dialog and basket become bottom sheets, and
   `document.documentElement.scrollWidth` stays within the client width.

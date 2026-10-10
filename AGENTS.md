# Khoshmazeh — working notes

A single-screen, scroll-scrubbed burger experience: the whole page is one full-viewport video
stage, and every UI element (header, order panel, cart, scroll cue, chapter captions) floats above
it. Vite + React + TypeScript + Tailwind, no backend.

## Running it here

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

* Web (Vite dev server, live reload): <http://localhost:3000> — the container serves 5173, mapped to
  host port **3000**. Only that port is public.
* Type-check / production build: `docker compose -f docker-compose.base44.yml exec web npm run build`

The stack is one service. Dependencies live in the named volume `web_node_modules` (the repo is
bind-mounted), so `up` reinstalls on start and a dependency change needs only a restart of `web` —
no rebuild, and never delete a volume to refresh dependencies.

## Non-obvious things worth knowing

* **The clip is re-encoded on purpose — don't drop the original in.** `assets/burger-master.mp4`
  (8s, 192 frames @ 24fps, 864x480) has a **single keyframe for the whole clip**, so every seek
  decoded from frame 0 and scrubbing stuttered badly. `public/media/burger-scrub.mp4` is that master
  re-encoded with `-g 4 -keyint_min 4 -sc_threshold 0 -bf 0` (a keyframe every 4 frames) plus
  `+faststart` and no audio: any seek decodes at most 3 frames. The exact command, and the poster
  extraction, sit at the top of [`src/components/heroMedia.ts`](src/components/heroMedia.ts).
* **Scrubbing is the experience, and it never plays the video.** [`useScrollVideoScrub`](src/hooks/useScrollVideoScrub.ts)
  is the whole engine: passive scroll/resize listeners only cache the *target* progress and wake one
  `requestAnimationFrame` loop; the loop eases the displayed progress toward it and writes
  `video.currentTime` only when the wanted time moved more than ~a frame. Nothing calls `play()`, and
  the element carries no `autoplay`/`loop`/`controls`. The tuning dials (smoothing, seek epsilon,
  frame-delta clamp) are the constants at the top of that hook.
* **The overlays are painted, not rendered.** The hook takes an `onProgress` callback and
  `BurgerHero` writes cue/caption/panel styles straight into refs, so scrolling causes zero React
  re-renders and zero extra layout reads. Captions are pre-rendered nodes (one per chapter) stacked
  in the same spot; only their opacity/visibility/transform change. Keep it that way — putting
  progress into React state reintroduces jank.
* **A caption's `visibility` must be written as `visible` explicitly.** Setting `style.visibility = ''`
  only removes the inline value, so a Tailwind `invisible` class on the same node silently wins and
  the caption never appears. That bug is why `ChapterCaptions` carries no `invisible` class.
* **Runway geometry** lives in [`src/lib/scrub.ts`](src/lib/scrub.ts): the runway is `320svh` on
  phones, `360svh` at `sm`, `400svh` at `lg`, with a `100svh` sticky stage pinned inside it, so the
  scrub distance is runway minus one viewport. The header nav uses the same helper to fly to a
  chapter, which is how the four nav items work on a single-screen site.
* **Overlay anchors are tuned to the docked order sheet**: cue and captions sit at `bottom-[13.5rem]`
  below `sm`, `sm:bottom-[10rem]`, `lg:bottom-24`. If the sheet's height or padding changes, re-check
  that the caption still clears it (there is ~16px of clearance at 375px wide).
* **The order panel is a side card at `lg`+ and a bottom sheet below it.** Below `lg` it must stay put
  while scrubbing (thumb reach), which is why the progress-driven transform is applied on desktop
  only. Its positioning wrapper is separate from the painted inner node — the wrapper keeps its own
  centring transform, the inner node is the one the rAF loop writes to.
* **`svh`, not `vh`** everywhere on the runway/stage: mobile browser chrome resizing must not shift
  the timeline.
* **`BASE44_PREVIEW_MODE`** gates sandbox-only dev-server tweaks in [`vite.config.ts`](vite.config.ts)
  (host allowlist for `.$BASE44_SANDBOX_HOST_DOMAIN`, `wss` HMR on port 443 for the https preview).
  Unset or any other value keeps stock Vite behaviour; nothing in the app reads the flag.
* **The cart is client-side only** — React state in [`src/store/cart.tsx`](src/store/cart.tsx) plus a
  client-side "order placed" confirmation. Nothing is persisted and there is no server: a reload
  empties the order. A real order backend would be greenfield.
* **All copy lives in [`src/data/site.ts`](src/data/site.ts)** (brand, product, price, the four
  chapters). The chapters double as the header navigation, so their `at` values (0.18 / 0.48 / 0.76 /
  0.99) are also the nav jump targets.
* `public/media/*` is served by the Vite dev server with HTTP range support, which is what lets the
  browser seek without downloading the whole file first — if the media ever moves behind a custom
  server, keep byte ranges working.

## How to verify a change here

1. `curl -sI http://localhost:3000/` answers, then load the page.
2. The clip scrubs: scroll to `top + 0.5 * span` (see `measureRunway()`) and check
   `video.currentTime` settles at about `duration / 2`; scroll back up and it must go *down*; stop
   scrolling and it must freeze (`paused === true`, no drift).
3. The nav jump for "Locations" lands at progress ≈ 0.76, and the scroll cue is hidden by ≈ 0.05.
4. Narrow the viewport: the order panel docks to the bottom, the nav collapses to a hamburger, and
   `document.documentElement.scrollWidth` stays within the client width.

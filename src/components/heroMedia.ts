/**
 * Media for the scroll-scrubbed burger.
 *
 * ## Why the clip is re-encoded (don't just drop the original file in)
 *
 * The interaction scrubs `video.currentTime` on every scroll, so random-access seek performance
 * IS the experience. A seek has to decode from the previous keyframe, and the supplied master
 * (`assets/burger-master.mp4` — 8s, 192 frames @ 24fps, 864x480) had a **single keyframe for the
 * whole clip**: every seek decoded from frame 0 and scrubbing stuttered badly.
 *
 * `public/media/burger-scrub.mp4` is re-encoded from that master:
 *
 *   - H.264 High, yuv420p — hardware decoded everywhere, fastest scrub path in browsers.
 *   - `-g 4 -keyint_min 4 -sc_threshold 0` — a keyframe every 4 frames (0.17s), evenly spaced,
 *     so any seek decodes at most 3 frames. This is the single most important knob.
 *   - `-bf 0` — no B-frames, so no frame reordering latency while seeking.
 *   - `-crf 22` — visually identical to the master, at 1.4 MB.
 *   - `-an` — the clip is scrubbed muted and always paused; audio would only waste bytes.
 *   - `-movflags +faststart` — the moov atom sits first, so seeking can begin before the whole
 *     file has arrived.
 *   - No rescale: the master is only 864x480 and a full-viewport stage would visibly soften
 *     anything smaller.
 *
 * To swap the footage, replace `assets/burger-master.mp4` and re-run, from the repo root:
 *
 *   docker run --rm -v "$PWD":/w --entrypoint sh jrottenberg/ffmpeg:6.0-alpine -c '
 *     ffmpeg -y -i /w/assets/burger-master.mp4 -an -c:v libx264 -preset slower -crf 22 \
 *       -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart \
 *       /w/public/media/burger-scrub.mp4
 *     ffmpeg -y -ss 0 -i /w/assets/burger-master.mp4 -frames:v 1 -q:v 4 \
 *       /w/public/media/burger-poster.jpg'
 */
export const BURGER_VIDEO_SRC = '/media/burger-scrub.mp4';

/** First frame — stands in while the clip buffers, so the stage never flashes black. */
export const BURGER_POSTER_SRC = '/media/burger-poster.jpg';

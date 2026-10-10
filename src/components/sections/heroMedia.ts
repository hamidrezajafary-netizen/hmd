/**
 * Hero media for the scroll-scrubbed 3D fly-through.
 *
 * ## Why the video is re-encoded (don't just drop the original file in)
 *
 * The interaction scrubs `video.currentTime` on every scroll, so random-access seek
 * performance IS the experience. A seek has to decode from the previous keyframe, and the
 * supplied master had a **single keyframe** for all 217 frames — every seek had to decode
 * from frame 0, which stutters badly.
 *
 * `public/media/hero-scrub.mp4` is re-encoded from that master
 * (`ویدیو هیروسکشن.mp4` in the repo root, kept as the untouched source):
 *
 *   - H.264 High, yuv420p — decoded in hardware everywhere, fastest scrub path in browsers.
 *   - `-g 6 -keyint_min 6 -sc_threshold 0` — a keyframe every 6 frames (0.25s), evenly
 *     spaced, so any seek decodes at most 5 frames. This is the single most important knob.
 *   - `-bf 0` — no B-frames, so no frame reordering latency while seeking.
 *   - `-crf 24` — SSIM 0.979 against the master (i.e. visually the same shot) at 6.4 MB,
 *     down from 10.4 MB.
 *   - `-an` — the track is scrubbed muted and always paused; audio would only waste bytes.
 *   - `-movflags +faststart` — the moov atom sits first, so the browser can start seeking
 *     before the whole file has arrived.
 *   - No downscale: the master is already only 1168x768, and a full-viewport hero would
 *     visibly soften anything smaller.
 *
 * A WebM/VP9 variant was measured (8.3 MB with the same 6-frame GOP) and rejected: it is
 * both larger than the MP4 and slower to seek, because browsers fall back to software VP9
 * decoding. Dense-keyframe H.264 is the fastest format available here.
 */
export const HERO_VIDEO_SRC = '/media/hero-scrub.mp4';

/** First frame of the video — stands in while the video buffers, so the reveal never flashes black. */
export const HERO_POSTER_SRC = '/media/hero-poster.jpg';

/** Original hero photograph: what the hero shows if the video cannot be used at all. */
export const HERO_FALLBACK_IMAGE = '1748063578185-3d68121b11ff';

/**
 * Media for the scroll-scrubbed walk-in.
 *
 * ## The clip is re-encoded on purpose — do not drop the camera original in
 *
 * The interaction scrubs `video.currentTime` on every scroll, so random-access seek performance
 * *is* the experience. A seek decodes forward from the previous keyframe, and the supplied master
 * (`assets/burger-master.mp4` — 9.0s, 217 frames @ 24fps, 1168x768) carries a **single keyframe for
 * the whole clip**: every seek decoded from frame 0 and scrubbing stuttered badly.
 *
 * `public/media/burger-scrub.mp4` is that master re-encoded with:
 *
 *   - H.264 High, yuv420p — hardware decoded everywhere, the fastest scrub path in browsers.
 *   - `-g 4 -keyint_min 4 -sc_threshold 0` — a keyframe every 4 frames (0.17s), evenly spaced, so
 *     any seek decodes at most 3 frames. This is the single most important knob: 54 keyframes
 *     instead of 1.
 *   - `-bf 0` — no B-frames, so no frame-reorder latency while seeking.
 *   - `-crf 21` — visually identical to the master.
 *   - `-an` — the clip is scrubbed while paused and always muted; audio would only waste bytes.
 *   - `-movflags +faststart` — the moov atom sits first, so seeking can start before the whole
 *     file has arrived.
 *   - No rescale: a full-viewport stage would visibly soften anything smaller than the master.
 *
 * To swap the footage, replace `assets/burger-master.mp4` and re-run from the repo root:
 *
 *   docker run --rm -v "$PWD":/w --entrypoint sh jrottenberg/ffmpeg:6.0-alpine -c '
 *     ffmpeg -y -i /w/assets/burger-master.mp4 -an -c:v libx264 -preset slower -crf 21 \
 *       -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart \
 *       /w/public/media/burger-scrub.mp4
 *     ffmpeg -y -ss 0 -i /w/assets/burger-master.mp4 -frames:v 1 -q:v 4 \
 *       /w/public/media/burger-poster.jpg'
 *
 * Re-check the keyframes with:
 *   ffprobe -v error -select_streams v:0 -show_entries frame=key_frame -of csv=p=0 <file> | sort | uniq -c
 */
export const STAGE_VIDEO_SRC = '/media/burger-scrub.mp4';

/** First frame — stands in while the clip buffers, so the stage never flashes black. */
export const STAGE_POSTER_SRC = '/media/burger-poster.jpg';

/**
 * Intrinsic size of the clip. The stage renders it with `object-fit: cover`, which crops a
 * different amount at every aspect ratio, so the hotspot overlay is sized to the *rendered video
 * box* rather than to the viewport — otherwise the tags would drift off their burgers as the
 * window changes shape. Keep this in step with the master.
 */
export const STAGE_VIDEO_SIZE = { width: 1168, height: 768 } as const;

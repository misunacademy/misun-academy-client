const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_ID_LOOSE_RE = /[A-Za-z0-9_-]{11}/;

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

function clean(input: string): string {
  return input.trim().replace(/^["'<]+|["'>]+$/g, '').trim();
}

/**
 * Extract a YouTube video id from:
 * - bare id ("dQw4w9WgXcQ")
 * - youtu.be/ID, youtube.com/watch?v=ID, /embed/ID, /shorts/ID, /live/ID, /v/ID
 * - youtube-nocookie.com/embed/ID, m.youtube.com, music.youtube.com
 * - full URL pasted with extra params (?v=ID&t=..&list=.. / ?si=..)
 * - a double-wrapped value like "https://...watch?v=<real-url-or-id>"
 * Returns null when no plausible id is found.
 */
export function extractVideoId(input: string | null | undefined): string | null {
  if (!input) return null;
  let value = clean(String(input));
  if (!value) return null;

  // Bare id fast-path (also strips a wrapping that is just the id with params)
  if (YOUTUBE_ID_RE.test(value)) return value;

  // Fast-path: any bare `v=<11-char-id>` param anywhere in the string.
  // This also rescues double-wrapped values like
  // `watch?v=https://...watch?v=<real-id>` where URL parsing would truncate
  // the inner URL at the second `?`.
  const vParams = [...value.matchAll(/[?&]v=([A-Za-z0-9_-]{11})(?=[&#?]|$)/g)].map((m) => m[1]);
  if (vParams.length > 0) return vParams[vParams.length - 1];

  // If someone pasted "watch?v=<full url>" (double-wrap from storing a URL
  // inside the videoId field), unwrap the inner value first. Only adopt the
  // inner value when it still looks video-ish — a truncated inner URL would
  // otherwise discard the real id sitting at the end of the outer string.
  for (let depth = 0; depth < 2; depth++) {
    const vMatch = value.match(/[?&]v=([^&#?]+)/);
    if (vMatch) {
      const inner = decodeURIComponent(vMatch[1]);
      if (YOUTUBE_ID_RE.test(inner)) return inner;
      // inner may itself be a full URL — continue parsing it below
      if (/^https?:\/\//i.test(inner) || inner.includes('youtu')) {
        if (/[?&]v=|\/(embed|shorts|live|v)\/|youtu\.be\//i.test(inner)) {
          value = inner;
          continue;
        }
        break;
      }
      const loose = inner.match(YOUTUBE_ID_LOOSE_RE);
      if (loose) return loose[0];
    }
    break;
  }

  // Try URL parsing
  try {
    const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
    const u = new URL(hasScheme ? value : `https://${value}`);

    const host = u.hostname.toLowerCase().replace(/^www\./, '');
    const hostFull = u.hostname.toLowerCase();

    if (YOUTUBE_HOSTS.has(hostFull) || YOUTUBE_HOSTS.has(host) || host.endsWith('youtube.com') || host === 'youtu.be') {
      // ?v= param (watch, attribution links, double-wrapped)
      const v = u.searchParams.get('v');
      if (v) {
        const decoded = decodeURIComponent(v);
        if (YOUTUBE_ID_RE.test(decoded)) return decoded;
        const loose = decoded.match(YOUTUBE_ID_LOOSE_RE);
        if (loose) return loose[0];
        // decoded may be another URL — recurse once
        if (/^https?:\/\//i.test(decoded)) {
          const nested = extractVideoId(decoded);
          if (nested) return nested;
        }
      }

      // Path-based: /embed/ID /shorts/ID /live/ID /v/ID /youtu.be/ID
      const segments = u.pathname.split('/').filter(Boolean);
      const markers = new Set(['embed', 'shorts', 'live', 'v', 'e']);
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (markers.has(seg) && segments[i + 1]) {
          const candidate = segments[i + 1].split(/[?&#]/)[0];
          if (YOUTUBE_ID_RE.test(candidate)) return candidate;
          const loose = candidate.match(YOUTUBE_ID_LOOSE_RE);
          if (loose) return loose[0];
        }
      }
      // youtu.be/<id>
      if ((host === 'youtu.be' || hostFull === 'youtu.be' || hostFull === 'www.youtu.be') && segments.length > 0) {
        const candidate = segments[0].split(/[?&#]/)[0];
        if (YOUTUBE_ID_RE.test(candidate)) return candidate;
        const loose = candidate.match(YOUTUBE_ID_LOOSE_RE);
        if (loose) return loose[0];
      }
      // nocookie embed: /embed/ID handled above; fall through to loose match
    }
  } catch {
    // not a parseable URL — fall through to loose match
  }

  // Last resort: any 11-char token in the string (covers pasted share text)
  const loose = value.match(YOUTUBE_ID_LOOSE_RE);
  // Only accept loose match when the input looks youtube-ish to avoid
  // misinterpreting a Drive id as a YouTube id.
  if (loose && (/youtu\.?be|youtube/i.test(value) || YOUTUBE_ID_RE.test(value))) {
    return loose[0];
  }
  return null;
}

/** Drive file ids are long base62-ish tokens (typically 25+ chars). */
const DRIVE_ID_RE = /^[A-Za-z0-9_-]{10,}$/;

export function extractDriveId(input: string | null | undefined): string | null {
  if (!input) return null;
  const value = clean(String(input));
  if (!value) return null;
  if (DRIVE_ID_RE.test(value) && value.length >= 15 && !value.includes('/') && !value.includes(' ')) {
    // bare drive id (avoid clashing with 11-char youtube ids)
    if (!YOUTUBE_ID_RE.test(value)) return value;
  }
  try {
    const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
    const u = new URL(hasScheme ? value : `https://${value}`);
    if (!u.hostname.toLowerCase().includes('drive.google')) return null;
    // /file/d/<id>/...
    const fileMatch = u.pathname.match(/\/file\/d\/([^/?#]+)/);
    if (fileMatch?.[1]) return fileMatch[1];
    // /open?id=<id> /uc?id=<id>
    const idParam = u.searchParams.get('id');
    if (idParam && DRIVE_ID_RE.test(idParam)) return idParam;
  } catch {
    return null;
  }
  return null;
}

export function isDriveUrl(input: string | null | undefined): boolean {
  if (!input) return false;
  return /drive\.google/i.test(String(input));
}

export type VideoSource = 'youtube' | 'googledrive';

/** Decide which player to use. Explicit source wins; otherwise infer from URL. */
export function resolveVideoSource(input: {
  url?: string | null;
  type?: string | null;
  videoSource?: string | null;
  videoId?: string | null;
}): VideoSource {
  const explicit = (input.type || input.videoSource || '').toLowerCase();
  if (explicit === 'googledrive' || explicit === 'drive') return 'googledrive';
  if (explicit === 'youtube' || explicit === 'yt') return 'youtube';
  if (isDriveUrl(input.url) || (!input.url && input.videoId && extractDriveId(input.videoId) && !extractVideoId(input.videoId))) {
    // bare drive id without a url still counts as drive only if it is NOT a youtube id
    return 'googledrive';
  }
  return 'youtube';
}

/** Strip a pasted URL down to the raw id for storage. Never returns a URL. */
export function normalizeVideoId(source: VideoSource | string, raw: string | null | undefined): string {
  if (!raw) return '';
  const value = clean(String(raw));
  if (!value) return '';
  if (source === 'googledrive') {
    return extractDriveId(value) ?? value;
  }
  return extractVideoId(value) ?? value;
}

export function buildYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function buildDrivePreviewUrl(driveId: string): string {
  return `https://drive.google.com/file/d/${driveId}/preview`;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const QUALITY_LABELS: Record<string, string> = {
  auto: 'Auto',
  small: '240p',
  medium: '360p',
  large: '480p',
  hd720: '720p',
  hd1080: '1080p',
  highres: '1440p+',
};

export function formatQualityLabel(level: string): string {
  return QUALITY_LABELS[level] ?? level.toUpperCase();
}

/** Human-friendly message for YouTube IFrame error codes. */
export function youtubeErrorMessage(code: number | null): string {
  switch (code) {
    case 2:
      return 'Invalid video link. Please check the lesson URL.';
    case 5:
      return 'This video cannot be played here. Try a different browser.';
    case 100:
    case 105:
      return 'This video is unavailable. It may be deleted or set to private.';
    case 101:
    case 150:
      return 'The video owner disabled embedding. Ask the instructor to enable embedding or use “Watch on YouTube”.';
    case 153:
      return 'Playback blocked (privacy / embedding settings). Try “Watch on YouTube”.';
    default:
      return 'This video cannot be played right now. Please try again later.';
  }
}

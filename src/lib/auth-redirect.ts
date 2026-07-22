const REDIRECT_ORIGIN_ENV_KEYS = [
  'NEXT_PUBLIC_MA_FRONTEND_URL',
  'NEXT_PUBLIC_EP_FRONTEND_URL',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_AUTH_URL',
] as const;

const REDIRECT_ORIGIN_FALLBACKS = [
  'https://esun.misun-academy.com',
] as const;

function toOrigin(urlLike?: string | null): string | null {
  if (!urlLike) return null;
  try {
    const u = new URL(urlLike);
    return `${u.protocol}//${u.host}`.toLowerCase();
  } catch {
    return null;
  }
}

export function isAllowedRedirectUrl(target?: string | null, currentOrigin?: string): boolean {
  if (!target) return false;

  if (target.startsWith('/')) return true;

  try {
    const targetOrigin = toOrigin(target);
    if (!targetOrigin) return false;

    const allowedOrigins = new Set<string>();

    for (const envKey of REDIRECT_ORIGIN_ENV_KEYS) {
      const envOrigin = toOrigin(process.env[envKey]);
      if (envOrigin) {
        allowedOrigins.add(envOrigin);
      }
    }

    const currentOriginParsed = toOrigin(currentOrigin);
    if (currentOriginParsed) {
      allowedOrigins.add(currentOriginParsed);
    }

    if (typeof window !== 'undefined') {
      allowedOrigins.add(`${window.location.protocol}//${window.location.host}`.toLowerCase());
    }

    for (const origin of REDIRECT_ORIGIN_FALLBACKS) {
      const parsed = toOrigin(origin);
      if (parsed) allowedOrigins.add(parsed);
    }

    return allowedOrigins.has(targetOrigin);
  } catch {
    return false;
  }
}

export function getRedirectUrlFromLocation(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  const params = new URLSearchParams(window.location.search);
  return params.get('redirect_url') || params.get('redirectTo') || undefined;
}

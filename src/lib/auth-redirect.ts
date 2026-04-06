const REDIRECT_HOST_ENV_KEYS = [
  'NEXT_PUBLIC_MA_FRONTEND_URL',
  'NEXT_PUBLIC_EP_FRONTEND_URL',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_AUTH_URL',
] as const;

const REDIRECT_HOST_FALLBACKS = [
  'esun.misun-academy.com',
] as const;

function toHostname(urlLike?: string | null): string | null {
  if (!urlLike) return null;

  try {
    return new URL(urlLike).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function isAllowedRedirectUrl(target?: string | null, currentOrigin?: string): boolean {
  if (!target) return false;

  if (target.startsWith('/')) return true;

  try {
    const targetHost = new URL(target).hostname.toLowerCase();
    const allowedHosts = new Set<string>();

    for (const envKey of REDIRECT_HOST_ENV_KEYS) {
      const envHost = toHostname(process.env[envKey]);
      if (envHost) {
        allowedHosts.add(envHost);
      }
    }

    const currentHost = toHostname(currentOrigin);
    if (currentHost) {
      allowedHosts.add(currentHost);
    }

    if (typeof window !== 'undefined') {
      allowedHosts.add(window.location.hostname.toLowerCase());
    }

    for (const host of REDIRECT_HOST_FALLBACKS) {
      allowedHosts.add(host);
    }

    return allowedHosts.has(targetHost);
  } catch {
    return false;
  }
}

export function getRedirectUrlFromLocation(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  const params = new URLSearchParams(window.location.search);
  return params.get('redirect_url') || params.get('redirectTo') || undefined;
}

'use client';

// Marketing/analytics consent (Meta Pixel, GA, CAPI). Necessary-only by
// default: nothing fires until the visitor explicitly accepts. Stored
// locally; "denied" is as final as "granted" (no nagging).

export type ConsentChoice = 'granted' | 'denied';

const CONSENT_KEY = 'ma-tracking-consent';
const CONSENT_EVENT = 'ma-tracking-consent-change';

export function getConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    return raw === 'granted' || raw === 'denied' ? raw : null;
  } catch {
    return null;
  }
}

export function hasGrantedConsent(): boolean {
  return getConsent() === 'granted';
}

export function setConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Storage unavailable — choice lasts for this page view only.
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_EVENT, { detail: choice }));
  }
}

export function onConsentChange(listener: (choice: ConsentChoice) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const handler = (event: Event) => {
    listener((event as CustomEvent<ConsentChoice>).detail);
  };
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

/** useSyncExternalStore-compatible subscription (no setState-in-effect). */
export function subscribeToConsent(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  return onConsentChange(() => callback());
}

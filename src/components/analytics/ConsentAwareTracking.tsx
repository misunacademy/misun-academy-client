'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { hasGrantedConsent, subscribeToConsent } from '@/lib/consent';
import { initPixel } from '@/lib/metaPixel';

/**
 * Consent-gated marketing scripts. Meta Pixel + GA render and initialize
 * only after an explicit opt-in; declining (or never choosing) leaves them
 * completely unloaded. Vercel Analytics (cookieless) stays unconditional.
 *
 * NOTE: the pixel script is injected exactly once via `initPixel()` —
 * do NOT add a second inline `fbevents.js` loader here. A duplicate loader
 * caused "Multiple pixels with conflicting versions" warnings and
 * `fbq is not defined` errors from the external script.
 */
export default function ConsentAwareTracking({
  pixelId,
  gaId,
}: {
  pixelId?: string;
  gaId?: string;
}) {
  const granted = useSyncExternalStore(
    subscribeToConsent,
    () => hasGrantedConsent(),
    () => false
  );

  useEffect(() => {
    if (granted && pixelId) initPixel(pixelId);
  }, [granted, pixelId]);

  if (!granted) return null;

  return (
    <>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { resetConsent } from '@/lib/consent';

/**
 * Footer entry point that clears the stored choice and re-opens the consent
 * banner, so a Decline is not permanent. `aria-pressed`/dialog semantics are
 * handled by the banner itself.
 */
export default function ConsentSettingsButton() {
  const t = useTranslations('consent');

  return (
    <button
      type="button"
      onClick={resetConsent}
      className="text-sm leading-relaxed text-white/60 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white/90 hover:decoration-white/60"
    >
      {t('settings')}
    </button>
  );
}

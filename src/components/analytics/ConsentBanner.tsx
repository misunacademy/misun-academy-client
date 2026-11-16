'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { getConsent, setConsent, subscribeToConsent, type ConsentChoice } from '@/lib/consent';

export default function ConsentBanner() {
  const t = useTranslations('consent');
  // Hidden on the server and until a choice is absent client-side.
  const visible = useSyncExternalStore(
    subscribeToConsent,
    () => getConsent() === null,
    () => false
  );

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-live="polite"
      aria-labelledby="consent-banner-title"
      className="fixed inset-x-0 bottom-0 z-[9998] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-h-[75vh] max-w-3xl flex-col gap-4 overflow-y-auto rounded-2xl border border-primary/20 bg-surface-darker/95 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:gap-6">
        <div className="flex-1 space-y-1.5">
          <p id="consent-banner-title" className="text-sm font-semibold text-white">
            {t('title')}
          </p>
          <p className="text-xs leading-relaxed text-white/60">
            {t('message')}
          </p>
          <Link
            href="/privacy-policy"
            className="inline-block text-xs font-medium text-primary-glow underline decoration-primary-glow/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
          >
            {t('policyLabel')}
          </Link>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="flex-1 rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white sm:flex-none"
          >
            {t('decline')}
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="flex-1 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 sm:flex-none"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}

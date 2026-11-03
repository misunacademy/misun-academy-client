'use client';
import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Analytics } from "@vercel/analytics/next";
import Providers from '@/providers/Providers';
import MetaPixelPageViewTracker from '@/components/analytics/MetaPixelPageViewTracker';
import ConsentAwareTracking from '@/components/analytics/ConsentAwareTracking';
import ConsentBanner from '@/components/analytics/ConsentBanner';

export default function ClientLayout({
  children,
  locale,
  messages,
}: Readonly<{
  children: React.ReactNode;
  locale: string;
  messages: Record<string, any>;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  return (
    <Providers>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none">
          Skip to main content
        </a>
        <Suspense fallback={null}>
          <MetaPixelPageViewTracker />
        </Suspense>

        {/* Marketing tracking (Pixel + GA) loads only after opt-in */}
        <ConsentAwareTracking pixelId={pixelId} gaId={GA_ID} />
        <ConsentBanner />

        {/* Vercel Analytics (Vercel hosting only — the script 404s on
            self-hosted/Docker deployments) */}
        {process.env.VERCEL ? <Analytics /> : null}

        <div id="main-content">{children}</div>
      </NextIntlClientProvider>
    </Providers>
  );
}

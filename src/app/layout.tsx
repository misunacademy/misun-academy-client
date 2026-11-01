import { Suspense } from 'react';
import { Analytics } from "@vercel/analytics/next";
import Providers from '@/providers/Providers';
import MetaPixelPageViewTracker from '@/components/analytics/MetaPixelPageViewTracker';
import ConsentAwareTracking from '@/components/analytics/ConsentAwareTracking';
import ConsentBanner from '@/components/analytics/ConsentBanner';
import type { Metadata } from 'next';
import { Hind_Siliguri, Mona_Sans } from 'next/font/google';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import WebSiteJsonLd from '@/components/seo/WebSiteJsonLd';
import './globals.css';
import '../bones/registry';

const monaSans = Mona_Sans({
  variable: '--font-mona-sans',
  subsets: ['latin'],
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '700'],
  variable: '--font-bangla',
  display: 'optional',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.misun-academy.com'),
  title: {
    default: 'Misun Academy',
    template: '%s | MISUN Academy',
  },
  description:
    'Build a successful career in the digital age by learning the right skills with MISUN Academy. From start to finish, we guide and support you to achieve your dreams in design and beyond.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  return (
    <html lang="bn" className={`${monaSans.variable} ${hindSiliguri.variable}`}>
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className=''>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none">
          Skip to main content
        </a>
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
}

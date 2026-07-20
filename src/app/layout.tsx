import Script from 'next/script';
import { Suspense } from 'react';
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import Providers from '@/providers/Providers';
import MetaPixelPageViewTracker from '@/components/analytics/MetaPixelPageViewTracker';
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
              {/* Meta Pixel */}
        {pixelId && (
          <>
            <Script
              id="facebook-pixel"
              strategy="lazyOnload"
            >
              {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body className=''>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none">
          Skip to main content
        </a>
        <Providers>
          <Suspense fallback={null}>
            <MetaPixelPageViewTracker />
          </Suspense>

          {/* Initialize GA tracking only if GA_ID is available */}
          {GA_ID && <GoogleAnalytics gaId={GA_ID} />}

          {/* Vercel Analytics (optional) */}
          <Analytics />

      
          <div id="main-content">{children}</div>
        </Providers>
      </body>
    </html>
  );
}

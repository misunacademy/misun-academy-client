import { getLocale, getMessages } from 'next-intl/server';
import type { Metadata } from 'next';
import localFont from "next/font/local";
import ClientLayout from './ClientLayout';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import WebSiteJsonLd from '@/components/seo/WebSiteJsonLd';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.misun-academy.com'),
  title: {
    default: 'Misun Academy',
    template: '%s | MISUN Academy',
  },
  description:
    'Build a successful career in the digital age by learning the right skills with MISUN Academy. From start to finish, we guide and support you to achieve your dreams in design and beyond.',
};

const unBangla = localFont({
  src: [
    {
      path: "../../public/fonts/UNBangla-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/UNBangla-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/UNBangla-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-un-bangla",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages] = await Promise.all([
    getLocale(),
    getMessages(),
  ]);

  return (
    <html lang={locale === 'bn' ? 'bn' : 'en'} className={unBangla.variable}>
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className=''>
        <ClientLayout locale={locale || 'en'} messages={messages}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

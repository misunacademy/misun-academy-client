import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ locale }: { locale?: string }) => {
  // Validate that the incoming `locale` parameter is valid
  const resolvedLocale = (locale as Locale) || defaultLocale;
  if (!locales.includes(resolvedLocale as Locale)) notFound();

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});

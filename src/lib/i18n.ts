import { useTranslations as useNextIntlTranslations } from 'next-intl';

export const locales = ['en', 'bn'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Get the user's preferred locale from a cookie, falling back to default.
 * Reads from `document.cookie` directly so it works both in Client and Server Components
 * (server reads from headers; client reads from document.cookie).
 */
export function getUserLocale(): Locale {
  if (typeof document === 'undefined') return defaultLocale;
  const match = document.cookie.match(/(?:^|; )misun_locale=([^;]+)/);
  const locale = match?.[1];
  return isLocale(locale ?? '') ? (locale as Locale) : defaultLocale;
}

/**
 * Set the user's locale cookie.
 */
export function setUserLocale(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.cookie = `misun_locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

/**
 * Format a price as BDT (Bangladeshi Taka) with the ৳ symbol.
 * Falls back to INR symbol for INR currency.
 */
export function formatBDT(amount: number | string | undefined, currency = 'BDT'): string {
  const value = typeof amount === 'number' ? amount : Number(amount || 0);
  if (Number.isNaN(value)) return '৳0';

  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  });

  const symbol = currency === 'INR' ? '₹' : '৳';
  return `${symbol} ${formatter.format(value)}`;
}

/**
 * Format a date in Bengali locale (bn-BD) with day, month, year.
 */
export function formatBanglaDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('bn-BD', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(d);
}

/**
 * Format a number using Bengali numerals (বাংলা সংখ্যা) when locale is bn.
 */
export function formatBanglaNumber(value: number, locale: Locale = 'en'): string {
  return new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-US', {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Wrap next-intl's useTranslations to always provide the user's locale.
 * Call this instead of `useTranslations` directly in Client Components.
 */
export function useTranslations(namespace?: string) {
  const t = useNextIntlTranslations(namespace ?? '');
  return t;
}

/**
 * Get the pathname without the locale prefix for internal routing.
 * next-intl typically prefixes routes with /en or /bn; this strips it.
 */
export function stripLocaleFromPath(pathname: string): string {
  for (const locale of locales) {
    const prefix = `/${locale}`;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return pathname === prefix ? '/' : pathname.slice(prefix.length);
    }
  }
  return pathname;
}

/**
 * Build a localized URL for a given locale.
 */
export function localizePath(pathname: string, locale: Locale): string {
  const stripped = stripLocaleFromPath(pathname);
  return locale === defaultLocale ? stripped : `/${locale}${stripped}`;
}

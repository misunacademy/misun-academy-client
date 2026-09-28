const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl) {
  // Fail fast in CI/prod builds — an undefined siteUrl silently emits a broken sitemap.
  throw new Error('NEXT_PUBLIC_SITE_URL is required to generate the sitemap');
}
module.exports = {
    siteUrl,
    generateRobotsTxt: true, // (optional) generate robots.txt file
    sitemapSize: 5000, // max URLs per sitemap file
    // Private/authenticated areas must never be indexed.
    exclude: [
      '/secret-page',
      '/admin/*',
      '/dashboard',
      '/dashboard/*',
      '/my-classes/*',
      '/profile',
      '/checkout',
      '/payment',
      '/auth/*',
      '/auth',
      '/verify-email',
      '/reset-password',
    ],
};

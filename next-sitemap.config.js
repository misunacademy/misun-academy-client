module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    generateRobotsTxt: true, // (optional) generate robots.txt file
    sitemapSize: 5000, // max URLs per sitemap file
    // Optional: exclude specific pages
    exclude: ['/secret-page', '/admin/*', '/dashboard'],
};

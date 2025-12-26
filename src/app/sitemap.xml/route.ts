const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

const URLS = [
    '/',
    '/about',
    '/courses',
    '/checkout',
    '/privacy-policy',
    '/terms-and-conditions',
    '/refund-policy',
    '/feedback',
];

export async function GET() {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${URLS
            .map(
                (path) => `
        <url>
          <loc>${SITE_URL}${path}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>`
            )
            .join('')}
    </urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}

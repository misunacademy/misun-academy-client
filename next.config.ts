
import fs from 'node:fs';
import path from 'node:path';
import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

// Turbopack resolves the workspace root from the parent monorepo (pnpm store)
// when present; in single-dir Docker contexts it falls back to this package.
const parentRoot = path.join(__dirname, '..');
const workspaceRoot = fs.existsSync(path.join(parentRoot, 'pnpm-workspace.yaml'))
  ? parentRoot
  : __dirname;

// CSP connect-src must include the API origin (cross-origin RTK Query calls)
// and frame-src must allow YouTube lesson embeds. Derived from build-time env
// so staging/prod origins work without config edits.
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_BASE_API_URL || '').origin;
  } catch {
    return null;
  }
})();
// Socket.IO upgrades to ws(s):// — an http(s) connect-src entry does NOT
// cover the ws(s) scheme, so derive the websocket origin too. Without this,
// realtime notifications are silently blocked in production.
const apiWsOrigin = (() => {
  if (!apiOrigin) return null;
  try {
    const u = new URL(apiOrigin);
    u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:';
    return u.origin;
  } catch {
    return null;
  }
})();
const connectSrc = [
  "'self'",
  'https://graph.facebook.com',
  'https://www.facebook.com',
  'https://www.google-analytics.com',
  'https://region1.google-analytics.com',
  ...(apiOrigin ? [apiOrigin] : []),
  ...(apiWsOrigin ? [apiWsOrigin] : []),
].join(' ');

const nextConfig: NextConfig = {
  turbopack: {
    root: workspaceRoot,
  },
  reactStrictMode: true,
  cacheComponents: true,
  // Slim production image: `server.js` + traced deps only.
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // Tightened CSP: inline scripts needed by Next + Meta Pixel/GA;
            // no unsafe frames/objects. Adjust connect-src if new APIs added.
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://www.googletagmanager.com https://www.google-analytics.com https://www.youtube.com https://s.ytimg.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https:",
              `connect-src ${connectSrc}`,
              "frame-src 'self' https://www.facebook.com https://www.youtube.com https://www.youtube-nocookie.com",
              "object-src 'none'",
              "base-uri 'self'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
        ],
      },
    ];
  },

  images: {
    qualities: [65, 75],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'securepay.sslcommerz.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.fbcd.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'www.misun-academy.com',
      },
      {
        protocol: 'https',
        hostname: 'misun-academy.com',
      },
    ],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);

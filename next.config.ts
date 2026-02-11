
import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable strict mode for better development warnings

  experimental: {
    optimizePackageImports: ['@/lib/metaPixel', 'lucide-react'],
  },

  images: {
    formats: ['image/avif', 'image/webp'], // Better compression formats
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
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);

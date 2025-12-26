
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // reactStrictMode: false, // Disable strict mode to prevent double rendering in development
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'securepay.sslcommerz.com',
      }
    ],
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['securepay.sslcommerz.com'], // ✅ Add this line
  },
};

export default nextConfig;

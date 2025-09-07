import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'poloandtweed.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  // Temporarily disable ESLint during builds to test database integration
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure webpack to handle native modules like better-sqlite3
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      // Exclude better-sqlite3 from webpack bundling on server side
      config.externals.push('better-sqlite3');
    }
    return config;
  },
};

export default withNextIntl(nextConfig);

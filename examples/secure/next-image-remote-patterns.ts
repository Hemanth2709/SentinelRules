// SECURE EXAMPLE
// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Only the hosts that actually serve this site's images.
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
};

export default nextConfig;

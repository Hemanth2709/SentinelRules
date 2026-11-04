// VULNERABLE EXAMPLE - do not copy into production code.
// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Any host: /_next/image?url=https://anything.example/huge.png&w=3840&q=100
    // makes the server download and resize images from anywhere.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;

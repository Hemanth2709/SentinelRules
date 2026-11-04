// Test fixtures for rules/next-image-remote-patterns.yml
// Each object is a Next.js config (next.config.ts / next.config.mjs).

import type { NextConfig } from 'next';

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

// Any host on any protocol.
export const anyHost: NextConfig = {
  images: {
    remotePatterns: [
      // ruleid: sentinel-next-image-wildcard-remote-pattern
      { protocol: 'https', hostname: '**' },
    ],
  },
};

// Single-segment wildcard host, next to a safe entry.
export const singleWildcard: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.example.com' },
      // ruleid: sentinel-next-image-wildcard-remote-pattern
      { protocol: 'http', hostname: '*', pathname: '/**' },
    ],
  },
};

// URL form (Next.js 15.3+): wildcard host.
export const urlForm: NextConfig = {
  images: {
    // ruleid: sentinel-next-image-wildcard-remote-pattern
    remotePatterns: [new URL('https://**/**')],
  },
};

// module.exports style, double-quoted.
module.exports = {
  images: {
    remotePatterns: [
      // ruleid: sentinel-next-image-wildcard-remote-pattern
      { hostname: "**" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

// Exact host.
export const exactHost: NextConfig = {
  images: {
    remotePatterns: [
      // ok: sentinel-next-image-wildcard-remote-pattern
      { protocol: 'https', hostname: 'cdn.example.com', pathname: '/uploads/**' },
    ],
  },
};

// Subdomain wildcard under a domain the site controls.
export const ownSubdomains: NextConfig = {
  images: {
    remotePatterns: [
      // ok: sentinel-next-image-wildcard-remote-pattern
      { protocol: 'https', hostname: '**.example.com' },
    ],
  },
};

// URL form with an exact host.
export const urlFormExact: NextConfig = {
  images: {
    // ok: sentinel-next-image-wildcard-remote-pattern
    remotePatterns: [new URL('https://cdn.example.com/images/**')],
  },
};

// A hostname: '**' outside images.remotePatterns is not an image allowlist.
export const unrelated = {
  // ok: sentinel-next-image-wildcard-remote-pattern
  proxy: { hostname: '**' },
};

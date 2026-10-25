// Test fixtures for rules/next-public-secrets.yml

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

// ruleid: sentinel-next-public-secret-env
export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  // ruleid: sentinel-next-public-secret-env
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY as string,
);

// ruleid: sentinel-next-public-secret-env
export const dbUrl = process.env['NEXT_PUBLIC_DATABASE_URL'];

// next.config.js style declaration
export const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_NAME: 'Sentinel Demo',
    // ruleid: sentinel-next-public-secret-env
    NEXT_PUBLIC_JWT_SIGNING_KEY: process.env.JWT_SIGNING_KEY,
  },
};

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

// Stripe publishable keys are designed to be used in the browser.
// ok: sentinel-next-public-secret-env
export const stripePublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Supabase anon keys are public by design (access is enforced by RLS).
// ok: sentinel-next-public-secret-env
export const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Analytics identifiers are intentionally public.
// ok: sentinel-next-public-secret-env
export const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Server-only secret without the public prefix.
// ok: sentinel-next-public-secret-env
export const serverStripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const serverConfig = {
  env: {
    // ok: sentinel-next-public-secret-env
    NEXT_PUBLIC_SITE_URL: 'https://example.com',
  },
};

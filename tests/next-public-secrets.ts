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

// v0.3.0: destructured from process.env (benchmark V-16).
// ruleid: sentinel-next-public-secret-env
export const { NEXT_PUBLIC_ADMIN_PASSWORD } = process.env;

// ruleid: sentinel-next-public-secret-env
const { NEXT_PUBLIC_APP_NAME, NEXT_PUBLIC_DB_PASSWORD: dbPassword } = process.env;

// v0.3.0: API keys and tokens from providers that never issue public keys
// (benchmark V-17). OpenAI and Anthropic keys must stay on the server.
// ruleid: sentinel-next-public-secret-env
export const assistantApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// ruleid: sentinel-next-public-secret-env
export const claudeKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

// ruleid: sentinel-next-public-secret-env
export const ghToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

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

// v0.3.0: destructuring a public name is fine.
// ok: sentinel-next-public-secret-env
export const { NEXT_PUBLIC_SITE_NAME } = process.env;

// A generic API key name is still not judged: many providers (maps, search,
// analytics) issue browser keys restricted by referrer.
// ok: sentinel-next-public-secret-env
export const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// ok: sentinel-next-public-secret-env
export const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

// Destructuring a server-only secret is not this rule's concern.
// ok: sentinel-next-public-secret-env
const { OPENAI_API_KEY } = process.env;

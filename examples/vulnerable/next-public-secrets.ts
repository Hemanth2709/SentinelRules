// VULNERABLE EXAMPLE - do not copy into production code.
// lib/stripe.ts imported by a Client Component.

import Stripe from 'stripe';

// NEXT_PUBLIC_ values are inlined into the browser bundle at build time,
// so this secret key is visible to anyone who opens DevTools.
export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

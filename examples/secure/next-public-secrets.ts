// SECURE EXAMPLE
// lib/stripe.server.ts - only imported from Route Handlers / Server Actions.

import 'server-only'; // build fails if a Client Component imports this file
import Stripe from 'stripe';

// Server-only variable: no NEXT_PUBLIC_ prefix, never sent to the browser.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// The publishable key is designed for client-side use.
export const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

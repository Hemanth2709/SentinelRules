# Public secrets: remediation

## Vulnerable

```ts
// lib/stripe.ts, imported by a Client Component
export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);
```

## Corrected

```ts
// lib/stripe.server.ts, imported only by Route Handlers / Server Actions
import 'server-only';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
```

Full files: [vulnerable](../../../examples/vulnerable/next-public-secrets.ts),
[secure](../../../examples/secure/next-public-secrets.ts).

## Why this fixes it

Without the `NEXT_PUBLIC_` prefix, Next.js does not inline the value into
client bundles; it is only available on the server. The `server-only` import
makes the build fail if a Client Component imports the module.

## Steps after a real exposure

1. **Rotate** the credential with the provider. Removing it from code does
   not remove it from already-deployed bundles, CDN caches, or archives.
2. Rename the variable without the prefix in every environment.
3. Move the code that uses it into a Route Handler, Server Action, or Server
   Component.
4. Search build output (`.next/static`) for the old value to confirm it is
   gone.

## Additional controls

- Secret scanning in CI and on the repository.
- Provider-side restrictions (IP allowlists, restricted API keys, RLS).

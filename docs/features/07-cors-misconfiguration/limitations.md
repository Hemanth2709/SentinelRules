# CORS: limitations

## Known false positives

- APIs that authenticate only with an `Authorization` header (no cookies).
  The configuration is still unnecessary, but the impact is lower.
- Internal services not reachable from browsers.

## Known false negatives

Confirmed not reported in an ad-hoc scan on 2026-10-25:

- Weak validation: `origin.endsWith('example.com')`, unanchored regexes.
- `origin: '*'` with `credentials: true`. Browsers reject this combination
  for credentialed requests, so it is a broken configuration rather than an
  exploitable one, and is left out of scope.

Not covered:

- Options assembled in variables or other modules.
- CORS headers set in Next.js middleware, `next.config.js` `headers()`, a
  reverse proxy, or API gateway.
- Allowlists that include `null` or attacker-registrable domains.

## Framework-specific limitations

NestJS can configure CORS in `NestFactory.create` options, `enableCors`, or an
Express/Fastify middleware; only inline object literals are inspected.

## What the rule cannot establish

Whether the API relies on ambient credentials, and therefore the real impact.

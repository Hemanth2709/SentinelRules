# Missing authorization: limitations

## Known false positives

- Routes protected by a **global guard** (`APP_GUARD`,
  `app.useGlobalGuards`) registered in another file. This is the largest
  expected source of false positives; projects using global guards should
  mark public routes with `@Public()` (which the rule honours) or disable this
  rule.
- Intentionally public endpoints not marked with a recognised decorator:
  login, registration, health checks (observed on the login routes in
  `examples/*/insecure-cookies.ts`).
- Webhooks protected by signature verification rather than a session.
- Next.js handlers protected by `middleware.ts`, a wrapper
  (`withAuth(handler)`), or an authentication helper with an unrecognised
  name.

## Known false negatives

- Routes with a guard that does not actually authorize (e.g. an
  authentication-only guard on an endpoint that needs an ownership check).
- Next.js handlers that call `auth()` but never check the result.
- Next.js `GET` handlers (excluded by design).
- Route handlers exported as arrow functions
  (`export const POST = async () => {}`).
- Inline Server Actions (`'use server'` inside a function body).
- Pages Router API routes (`pages/api/*`).
- NestJS GraphQL resolvers, WebSocket gateways, and microservice handlers.
- Custom composite decorators (e.g. `@Auth()` built with `applyDecorators`)
  are treated as unprotected – a false positive, not a negative – unless they
  are one of the recognised names.

## Cross-file limitations

Semgrep evaluates each file independently here. It cannot see global guards,
module configuration, middleware matchers, or reverse-proxy rules.

## What the rule cannot establish

Whether authorization is correct. A session check does not prove the user may
access a particular resource or tenant. Findings must be presented and
triaged as review candidates.

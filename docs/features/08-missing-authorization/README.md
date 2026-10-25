# Rule 08: Missing authorization controls (heuristic)

| | |
|---|---|
| Rule IDs | `sentinel-nestjs-route-missing-guard`, `sentinel-nextjs-handler-missing-auth-check` |
| Rule file | [`rules/missing-authorization.yml`](../../../rules/missing-authorization.yml) |
| Test fixture | [`tests/missing-authorization.ts`](../../../tests/missing-authorization.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/missing-authorization.ts) · [secure](../../../examples/secure/missing-authorization.ts) |
| Severity | WARNING |
| Confidence | LOW |
| CWE | CWE-862 (both), CWE-306 (Next.js) |
| OWASP | A01:2021 Broken Access Control (both), A07:2021 (Next.js) |
| Status | Tested |

## Purpose

**This is a heuristic.** Findings are candidates for review, not proof that
authorization is missing.

1. **NestJS** – route handlers (`@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`,
   `@All`, `@Options`, `@Head`) inside a `@Controller` where neither the
   method nor the controller has `@UseGuards(...)`, and the method or
   controller is not marked `@Public()`, `@SkipAuth()`, or `@AllowAnonymous()`.
2. **Next.js** – exported `POST`, `PUT`, `PATCH`, `DELETE` route handlers, and
   exported functions after a `'use server'` directive (Server Actions), that
   do not call a recognised authentication helper.

## Recognised Next.js authentication helpers

`getServerSession`, `auth`, `getSession`, `getToken`, `currentUser`,
`getAuth`, `verifySession`, `requireAuth`, `requireUser`, `requireSession`,
`<client>.auth.getUser`, `<client>.auth.getSession`.

## Running the tests

```bash
semgrep --test --config rules/missing-authorization.yml tests/missing-authorization.ts
```

## Interpreting a finding

1. Is there a global guard (`APP_GUARD` provider, `app.useGlobalGuards`) or
   Next.js `middleware.ts` that covers this route? If so, the route may be
   protected – confirm that the global control does not exempt it.
2. Is the endpoint meant to be public (login, health check, webhook with
   signature verification)? Mark it explicitly (`@Public()`) so the intent is
   visible.
3. If it is protected, does it check access to **the specific resource**
   (ownership, tenant, role), not just that someone is signed in?

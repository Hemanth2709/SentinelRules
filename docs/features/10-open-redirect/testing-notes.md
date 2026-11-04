# Open redirect: testing notes

Fixture: [`tests/open-redirect.ts`](../../../tests/open-redirect.ts)

## Expected findings

| Case | Pattern |
|---|---|
| GET handler | `new URL(next, request.url)` into `NextResponse.redirect` |
| middleware | `nextUrl.searchParams` into `NextResponse.redirect` |
| Server Action | `formData.get(...)` into `redirect()` |
| Express | `req.query.next` into `res.redirect` |
| NestJS | `@Query()` into `res.redirect`; `{ url }` returned from `@Redirect()` |
| PUT handler | JSON body into `Response.redirect` |

## Expected non-findings

| Case | Pattern |
|---|---|
| constantRedirect | constant destination |
| fromMap | key into a constant `DESTINATIONS` map |
| validated | `if (!isSafeRedirect(next)) ...` |
| sanitized | `safeRedirectPath(...)` |
| Express | encoded id in a fixed `/account/orders/` path |
| SearchController | returns data, not a redirect |

## Commands

```bash
semgrep --test --config rules/open-redirect.yml tests/open-redirect.ts
semgrep scan --metrics=off --config rules/open-redirect.yml tests/open-redirect.ts   # duplicate check
scripts/run-tests.sh
```

## Results

- 2026-11-04, Semgrep 1.180.0: `1/1: ✓ All tests passed`. `semgrep scan` on the
  fixture reports one finding per `ruleid` line, no duplicates.
- Failures during development are recorded in the
  [implementation log](implementation-log.md).
- Not yet measured on real applications; see
  [benchmark-results.md](../../benchmark-results.md).

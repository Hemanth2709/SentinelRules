# Rule 10: Open redirect

| | |
|---|---|
| Rule ID | `sentinel-open-redirect-user-controlled-url` |
| Rule file | [`rules/open-redirect.yml`](../../../rules/open-redirect.yml) |
| Test fixture | [`tests/open-redirect.ts`](../../../tests/open-redirect.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/open-redirect.ts) · [secure](../../../examples/secure/open-redirect.ts) |
| Severity | WARNING |
| Confidence | MEDIUM |
| CWE | CWE-601 |
| OWASP | A01:2021 Broken Access Control |
| Status | Released (v0.2.0) |

## Purpose

Flags redirects whose destination comes from the incoming request: `NextResponse.redirect`, `redirect` / `permanentRedirect` from `next/navigation`, `Response.redirect`, Express/NestJS `res.redirect`, and the `{ url }` returned from a NestJS `@Redirect()` handler.

This is a taint-mode rule: it follows a value from the request to the
dangerous call within one file ([DEC-010](../../decisions/decision-log.md)).

## Running the tests

```bash
semgrep --test --config rules/open-redirect.yml tests/open-redirect.ts
```

## Interpreting a finding

Check whether the destination can be an absolute URL or a protocol-relative path (`//evil.example`). `new URL(next, request.url)` does not help: an absolute `next` replaces the base. If the value is validated elsewhere, record the finding with `nosemgrep` and the reason.

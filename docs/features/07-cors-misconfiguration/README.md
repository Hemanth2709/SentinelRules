# Rule 07: CORS misconfiguration with credentials

| | |
|---|---|
| Rule ID | `sentinel-cors-credentials-any-origin` |
| Rule file | [`rules/cors-misconfiguration.yml`](../../../rules/cors-misconfiguration.yml) |
| Test fixture | [`tests/cors-misconfiguration.ts`](../../../tests/cors-misconfiguration.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/cors-misconfiguration.ts) · [secure](../../../examples/secure/cors-misconfiguration.ts) |
| Severity | ERROR |
| Confidence | HIGH |
| CWE | CWE-942, CWE-346 |
| OWASP | A05:2021 Security Misconfiguration, A01:2021 Broken Access Control |
| Status | Tested |

## Purpose

Flags CORS configurations that allow credentials **and** accept any origin:

- `{ origin: true, credentials: true }` for `app.enableCors()`, the `cors`
  package, or `NestFactory.create(..., { cors })`.
- An origin callback that always allows (`cb(null, true)`) or echoes the
  origin (`cb(null, origin)`), with `credentials: true`.
- Hand-written headers that copy `req.headers.origin` into
  `Access-Control-Allow-Origin` and set
  `Access-Control-Allow-Credentials: true` in the same block.

## Running the tests

```bash
semgrep --test --config rules/cors-misconfiguration.yml tests/cors-misconfiguration.ts
```

## Interpreting a finding

These patterns are almost always a real problem if the API uses cookies or
other ambient credentials. If the API authenticates only with an
`Authorization` header that the browser does not send automatically, the
impact is lower, but `credentials: true` is then unnecessary and should be
removed.

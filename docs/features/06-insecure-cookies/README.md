# Rule 06: Insecure session cookies

| | |
|---|---|
| Rule ID | `sentinel-insecure-session-cookie` |
| Rule file | [`rules/insecure-cookies.yml`](../../../rules/insecure-cookies.yml) |
| Test fixture | [`tests/insecure-cookies.ts`](../../../tests/insecure-cookies.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/insecure-cookies.ts) · [secure](../../../examples/secure/insecure-cookies.ts) |
| Severity | WARNING |
| Confidence | MEDIUM |
| CWE | CWE-1004, CWE-614, CWE-1275 |
| OWASP | A05:2021 Security Misconfiguration, A07:2021 Identification and Authentication Failures |
| Status | Tested |

## Purpose

Flags cookies that look like session or credential cookies and are set
without all three of `httpOnly: true`, `secure` (present and not `false`),
and an explicit `sameSite`.

## APIs covered

| Framework | API |
|---|---|
| Express / NestJS (`@Res()`) | `res.cookie(name, value, options?)` |
| Next.js App Router | `cookies().set(name, value, options?)`, `(await cookies()).set(...)` |
| Next.js `NextResponse` | `response.cookies.set(name, value, options?)` |

## Session-cookie heuristic

Only cookies whose **literal name** contains `sess`, `sid`, `auth`, `token`,
`jwt`, `refresh`, `access`, `login`, or `remember` are checked. UI
preference cookies such as `theme` are ignored, because they may need to be
readable by client JavaScript.

## Running the tests

```bash
semgrep --test --config rules/insecure-cookies.yml tests/insecure-cookies.ts
```

## Interpreting a finding

Check which attribute is missing. `secure` may legitimately be conditional on
the environment (`secure: process.env.NODE_ENV === 'production'` is accepted).
`sameSite: 'none'` is accepted as an explicit choice for cross-site
deployments – confirm that it is intended and that CSRF is handled.

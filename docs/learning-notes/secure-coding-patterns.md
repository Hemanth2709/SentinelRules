# Secure coding patterns

| Problem | Secure pattern |
|---|---|
| SQL injection | Bound parameters (`$queryRaw` tagged template, `$1`/`?` placeholders); allowlists for identifiers |
| JWT verification | Explicit `algorithms`, expiration enforced, `issuer`/`audience` checked, short lifetimes |
| Mass assignment | `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`; separate DTOs per operation; explicit mapping to persistence |
| Secret exposure | Server-only variables (no `NEXT_PUBLIC_`), `import 'server-only'`, rotate exposed secrets |
| XSS | Render text via JSX; if HTML is required, sanitize with DOMPurify and a narrow allowlist at render time |
| Cookies | `httpOnly: true`, `secure` in deployed environments, deliberate `sameSite`, `__Host-` prefix |
| CORS | Exact-match origin allowlist; drop `credentials` when not needed |
| Authorization | Deny-by-default global guard with explicit `@Public()`; check ownership/tenant per resource; scope queries by owner |

Detailed before/after code is in each feature's `remediation.md` and in
`examples/secure/`.

# Rule 04: Secrets in `NEXT_PUBLIC_*` environment variables

| | |
|---|---|
| Rule ID | `sentinel-next-public-secret-env` |
| Rule file | [`rules/next-public-secrets.yml`](../../../rules/next-public-secrets.yml) |
| Test fixture | [`tests/next-public-secrets.ts`](../../../tests/next-public-secrets.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/next-public-secrets.ts) · [secure](../../../examples/secure/next-public-secrets.ts) |
| Severity | ERROR |
| Confidence | MEDIUM |
| CWE | CWE-200, CWE-522 |
| OWASP | A01:2021 Broken Access Control, A05:2021 Security Misconfiguration |
| Status | Tested |

## Purpose

Flags references to, or declarations of, `NEXT_PUBLIC_` environment variables
whose names clearly indicate a credential – `SECRET`, `PRIVATE`, `PASSWORD`,
`SERVICE_ROLE`, `DATABASE_URL`, `SIGNING_KEY` and similar.

## What is reported

- `process.env.NEXT_PUBLIC_<...SECRET...>`
- `process.env['NEXT_PUBLIC_<...SECRET...>']`
- Keys in a `next.config.js` `env: { ... }` block.

## Running the tests

```bash
semgrep --test --config rules/next-public-secrets.yml tests/next-public-secrets.ts
```

## Interpreting a finding

The finding is based on the **name**. Check what value is actually deployed
under that name. If it is a real secret, assume it has already been exposed
in every build that shipped: rotate it, then move it to a server-only
variable.

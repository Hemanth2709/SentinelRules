# Public secrets: testing notes

Fixture: [`tests/next-public-secrets.ts`](../../../tests/next-public-secrets.ts)

## Expected findings

| Case | Form |
|---|---|
| `NEXT_PUBLIC_STRIPE_SECRET_KEY` | dot access |
| `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` | dot access |
| `NEXT_PUBLIC_DATABASE_URL` | bracket access |
| `NEXT_PUBLIC_JWT_SIGNING_KEY` | `next.config.js` `env` key |

## Expected non-findings

| Case | Reason |
|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | public by design |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public by design |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | public identifier |
| `STRIPE_SECRET_KEY` | server-only |
| `NEXT_PUBLIC_SITE_URL` in `env` | not a credential |

## Commands

```bash
semgrep --test --config rules/next-public-secrets.yml tests/next-public-secrets.ts
scripts/run-tests.sh
```

## Results

| Date | Semgrep | Result |
|---|---|---|
| 2026-10-25 | 1.180.0 | `✓ All tests passed` (4 findings, 5 non-findings) on first run |
| 2026-11-04 | 1.180.0 | v0.3.0: `✓ All tests passed` (9 findings, 9 non-findings); direct scan 9 findings, no duplicates |

## Failures and resolutions

None recorded.
| 2026-11-04 | New fixtures for destructuring and provider keys failed against the v0.2.0 rule (`missed lines: [34, 37, 42, 45, 48]`). | Added destructuring patterns (plain and renamed) and the provider-name alternative in the name regex. |

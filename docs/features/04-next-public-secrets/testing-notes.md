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
semgrep --test --config rules/ tests/
```

## Results

| Date | Semgrep | Result |
|---|---|---|
| 2026-10-25 | 1.180.0 | `✓ All tests passed` (4 findings, 5 non-findings) on first run |

## Failures and resolutions

None recorded.

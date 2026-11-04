# Public secrets: detection logic

Rule: [`rules/next-public-secrets.yml`](../../../rules/next-public-secrets.yml)

## Matching

Three forms bind the variable name to `$NAME`:

| Form | Pattern |
|---|---|
| Dot access | `process.env.$NAME` |
| Bracket access | `process.env[$KEY]` with `$KEY` matching `"$NAME"` |
| `next.config.js` | `{..., $NAME: $VALUE, ...}` inside `{..., env: {...}, ...}`, focused on the key |

## Filtering

1. `$NAME` must start with `NEXT_PUBLIC_` and contain one of:
   `SECRET`, `PRIVATE`, `PASSWORD`, `PASSWD`, `SERVICE_ROLE`,
   `SERVICE_ACCOUNT`, `DATABASE_URL`, `DB_URL`, `CONNECTION_STRING`,
   `CREDENTIAL`, `SIGNING_KEY`, `ENCRYPTION_KEY`, `ADMIN_KEY`, `MASTER_KEY`.
2. `$NAME` must **not** contain `PUBLISHABLE`, `PUBLIC_KEY`, or `ANON_KEY`
   (negative look-ahead regex).

## Why these indicators

`TOKEN`, `API_KEY`, and `KEY` were deliberately left out. They appear in many
intentionally public variable names (Mapbox tokens, Firebase API keys,
Algolia search-only keys), and including them would make most findings noise.
The trade-off is documented in [limitations.md](limitations.md).

## Safe patterns that should not match

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_SITE_URL`
- `process.env.STRIPE_SECRET_KEY` (no public prefix)

## Why the detector may miss cases

- Secrets under ambiguous names (`NEXT_PUBLIC_OPENAI_API_KEY`).
- Destructuring: `const { NEXT_PUBLIC_DB_PASSWORD } = process.env`.
- `.env` files are not scanned (they are not JavaScript).

## v0.3.0 additions

- **Destructuring:** `const { NEXT_PUBLIC_X } = process.env`,
  `const { NEXT_PUBLIC_X: alias } = process.env` and the `let` form bind
  `$NAME` to the property name, which then goes through the same name checks.
- **Provider keys:** the name regex also matches keys or tokens named
  after providers that issue no browser-safe keys:
  `NEXT_PUBLIC_*(OPENAI|ANTHROPIC|GROQ|MISTRAL|COHERE|REPLICATE|HUGGING_FACE|DEEPSEEK|SENDGRID|RESEND|MAILGUN|POSTMARK|TWILIO)*(KEY|TOKEN)*`,
  and `*_TOKEN` names for GitHub, GitLab, npm, Slack, Discord and Hugging
  Face (`HF`). Generic `API_KEY` or `TOKEN` names are still not matched.

# Public secrets: limitations

## Known false positives

- Names that contain an indicator word but hold a non-secret, e.g.
  `NEXT_PUBLIC_PRIVATE_BETA_ENABLED` (confirmed reported in an ad-hoc scan on
  2026-10-25). Rename the variable or suppress with a justification.
- A variable that is referenced only in server code. Next.js inlines
  `NEXT_PUBLIC_` values wherever they are referenced; if the only reference is
  on the server, the value may not reach a client bundle – but the name still
  invites future misuse.

## Known false negatives

Confirmed not reported in an ad-hoc scan on 2026-10-25:

- Ambiguous names: `NEXT_PUBLIC_OPENAI_API_KEY`, `NEXT_PUBLIC_GITHUB_TOKEN`.
- Destructuring: `const { NEXT_PUBLIC_DB_PASSWORD } = process.env`.

Not covered by design:

- `.env`, `.env.local`, and deployment-platform settings.
- Secrets hard-coded as literals in client code (use a secret scanner).
- Values that are secrets but whose names are generic (`NEXT_PUBLIC_CONFIG`).

## Patterns requiring manual review

Any finding: the rule judges the name, not the value.

## What the rule cannot establish

Whether the deployed value is actually sensitive, or whether the reference
ends up in a client bundle.

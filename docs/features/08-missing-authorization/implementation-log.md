# Missing authorization: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-10-25 | Experimented with decorator, `pattern-not-inside`, and nested-call negation behaviour in a scratch file | Confirm Semgrep semantics before writing the heuristic | Ad-hoc scans | Found that `function $M` negations do not cover `export` forms |
| 2026-10-25 | Created `sentinel-nestjs-route-missing-guard` | Flag routes without visible guards | `semgrep --validate` | Failed: `$PUBLIC` only bound negatively |
| 2026-10-25 | Replaced `$PUBLIC` regex with explicit `@Public()`, `@SkipAuth()`, `@AllowAnonymous()` negations | Fix validation error | `semgrep --test`, 2 positive / 4 negative | Pass |
| 2026-10-25 | Created `sentinel-nextjs-handler-missing-auth-check` for mutating route handlers and Server Actions | Flag Next.js endpoints without a recognised session check | `semgrep --test`, 3 positive / 4 negative | Pass |
| 2026-10-25 | Added Server Action fixtures after a mid-file `'use server'` directive | Server Action branch was untested | `semgrep --test` | Pass |
| 2026-10-25 | Wrote feature documentation and examples | Milestone 3 deliverable | `scripts/check-examples.sh` | Pass |
| 2026-10-25 | Server Action branch now requires `export async function` | IdentityProvider benchmark: 7 of 8 findings were non-async factory functions in a `'use server'` file, which Next.js does not treat as actions | New `createRemoveProjectAction` fixture failed before the change (`incorrect lines: [136]`) and passes after; full suite 10/10 | Fixed; app re-scan pending |

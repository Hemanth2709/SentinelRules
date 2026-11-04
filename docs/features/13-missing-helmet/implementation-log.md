# Missing Helmet: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-11-04 | Wrote `tests/missing-helmet.ts` (3 `ruleid`, 5 `ok`) before the rule | Failing test first | `semgrep --test` with a stub rule | Failed as expected: 3 missed lines |
| 2026-11-04 | Created the rule | Detect apps that listen without helmet | `semgrep --validate` | Failed: `$HELMET` was bound only in negations, so `metavariable-regex` on it is invalid |
| 2026-11-04 | Listed `helmet` and `fastifyHelmet` explicitly in the negations | Same gotcha as Rule 08 | `semgrep --test`; `semgrep scan` for duplicates | Pass, 3 findings, no duplicates |
| 2026-11-04 | Wrote examples and documentation; added `helmet()` to the secure CORS and ValidationPipe examples | The new rule correctly flagged both secure examples | `scripts/check-examples.sh` | Pass |
| 2026-11-04 | Released in v0.3.0 (tag on `b946320`) | Milestone 6 | Rule unchanged since the benchmarked commit `76cb377` | Released |

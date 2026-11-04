# Open redirect: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-11-04 | Wrote `tests/open-redirect.ts` (7 `ruleid`, 6 `ok`) before the rule | Failing test first | `semgrep --test` with a stub rule | Failed as expected: 7 missed lines |
| 2026-11-04 | Added `@Redirect()` to the NestJS `{ url }` case | A returned object is only a redirect under that decorator | Fixture review | Fixture corrected |
| 2026-11-04 | Created the taint rule | Detect request data reaching redirect destinations | `semgrep --test`; `semgrep scan` for duplicates | Pass, 7 findings, no duplicates |
| 2026-11-04 | Wrote examples and documentation | v0.2.0 deliverable | `scripts/check-examples.sh` | Pass |
| 2026-11-04 | Released in v0.2.0 (tag on `3b00ec6`) | Milestone 5 | Rules identical to the benchmarked commit `add589d` | Released |

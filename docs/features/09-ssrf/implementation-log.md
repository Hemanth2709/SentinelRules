# SSRF: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-11-04 | Wrote `tests/ssrf.ts` (7 `ruleid`, 6 `ok`) before the rule | Failing test first | `semgrep --test` with a stub rule | Failed as expected: 7 missed lines |
| 2026-11-04 | Created the taint rule | Detect request data reaching HTTP client URLs | `semgrep --test` | Failed: 4 missed lines. The `$METHOD` regex applied to every sink branch, so `fetch(...)` (no `$METHOD`) was filtered out |
| 2026-11-04 | Scoped the method and client-name regexes to the member-call branch | Fix the filter | `semgrep --test`; `semgrep scan` for duplicates | Pass, 7 findings, no duplicates |
| 2026-11-04 | Added the Server Action `FormData` source and fixture | Same sources as Rule 10 | Fixture failed first (1 missed), then passed | Pass, 8 findings |
| 2026-11-04 | Wrote examples and documentation | v0.2.0 deliverable | `scripts/check-examples.sh` | Pass |
| 2026-11-04 | Released in v0.2.0 (tag on `3b00ec6`) | Milestone 5 | Rules identical to the benchmarked commit `add589d` | Released |

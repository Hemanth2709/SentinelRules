# Image remotePatterns: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-11-04 | Wrote `tests/next-image-remote-patterns.ts` (4 `ruleid`, 4 `ok`) before the rule | Failing test first | `semgrep --test` with a stub rule | Failed as expected: 4 missed lines |
| 2026-11-04 | Created the rule | Detect wildcard hosts in images.remotePatterns | `semgrep --test`; `semgrep scan` for duplicates | Pass, 4 findings, no duplicates |
| 2026-11-04 | Wrote examples and documentation | v0.3.0 deliverable | `scripts/check-examples.sh` | Pass |
| 2026-11-04 | Released in v0.3.0 (tag on `b946320`) | Milestone 6 | Rule unchanged since the benchmarked commit `76cb377` | Released |

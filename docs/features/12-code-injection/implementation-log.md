# Code injection: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-11-04 | Wrote `tests/code-injection.ts` (6 `ruleid`, 4 `ok`) before the rule | Failing test first | `semgrep --test` with a stub rule | Failed as expected: 6 missed lines |
| 2026-11-04 | Created the taint rule | Detect request data executed as code | `semgrep --test`; `semgrep scan` for duplicates | Pass, 6 findings, no duplicates |
| 2026-11-04 | Wrote examples and documentation | v0.2.0 deliverable | `scripts/check-examples.sh` | Pass. The secure example's POST handler is also flagged by the Rule 08 heuristic (public calculator), recorded in Rule 08's limitations |
| 2026-11-04 | Released in v0.2.0 (tag on `3b00ec6`) | Milestone 5 | Rules identical to the benchmarked commit `add589d` | Released |

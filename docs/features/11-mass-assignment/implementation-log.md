# Mass assignment: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-11-04 | Wrote `tests/mass-assignment.ts` (7 `ruleid`, 5 `ok`) before the rule | Failing test first | `semgrep --test` with a stub rule | Failed as expected: 7 missed lines |
| 2026-11-04 | Created the taint rule | Detect whole request objects written to the database | `semgrep --validate` | Failed: a sink branch had only a `focus-metavariable` and a negation (no positive term) |
| 2026-11-04 | Split the sinks into whole-object and spread cases | Each branch needs a positive pattern | `semgrep --validate`; `semgrep --test` | Failed: YAML anchors are rejected; `"{...}"` did not exclude object literals; untyped `@Body() $PARAM` also matched a DTO-typed parameter (4 incorrect lines, 2 duplicates) |
| 2026-11-04 | Expanded the anchor, required an identifier via `metavariable-regex`, kept only loose `@Body()` types | Fix the three causes | `semgrep --test`; `semgrep scan` for duplicates | Pass, 7 findings, no duplicates |
| 2026-11-04 | Wrote examples and documentation | v0.2.0 deliverable | `scripts/check-examples.sh` | Pass |
| 2026-11-04 | Released in v0.2.0 (tag on `3b00ec6`) | Milestone 5 | Rules identical to the benchmarked commit `add589d` | Released |

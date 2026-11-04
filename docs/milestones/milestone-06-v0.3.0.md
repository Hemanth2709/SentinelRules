# Milestone 6: v0.3.0

## Milestone metadata

- Milestone number: 6
- Started: 2026-11-04
- Status: In progress

## Objective

Finish the v0.2.0 roadmap's remaining rules (missing Helmet, wildcard image
`remotePatterns`), then close documented gaps in the existing rules.

## Planned work

| Task | State |
|---|---|
| Rule 13: Missing Helmet | Done – 3 `ruleid`, 5 `ok` |
| Rule 14: Image `remotePatterns` | Done – 4 `ruleid`, 4 `ok` |
| Benchmark extended (7 cases, predictions first) | Done – 77% precision, 69% recall (24/35), no differences from predictions; see [benchmark-results.md](../benchmark-results.md) |
| Documented gaps in rules 01–08 | Done for 01, 02, 04, 06, 07 (benchmark misses V-03, V-06, V-10, V-11, V-14, V-16, V-17 now detected). 03 and 08 unchanged: their remaining gaps need cross-file analysis (global guards, global pipes) or are IDOR (V-23), which a single-file rule cannot establish |
| Taint mode for Rules 01 and 05 | Done – `sentinel-sql-injection-tainted-query` (6 `ruleid`, 7 `ok`) and `sentinel-dom-html-sink-user-input` (7 `ruleid`, 6 `ok`); neither reports a line its structural rule already reports |
| Benchmark for the gap fixes (6 cases, predictions first) | Done – 80% precision, 89% recall (33/37); no differences from predictions |
| Release v0.3.0 | Ready: release notes drafted; tag to be created from the GitHub UI |

## Testing and validation

| Step | Result |
|---|---|
| `scripts/run-tests.sh` | `All 14 rule files passed.` (rules 13–14); `All 16 rule files passed.` (gap fixes and taint rules, 2026-11-04) |
| `scripts/check-examples.sh` | 28 `PASS` lines; 32 after the two taint rule files were added |
| New-rule fixtures before each rule existed (stub rule) | Failed as expected for rules 13 and 14, and for all four new v0.3.0 rule IDs; extended fixtures for rules 01, 04, 06 and 07 failed against the old rules first |

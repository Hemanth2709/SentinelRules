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
| Benchmark extended (7 cases, predictions first) | Done – see [benchmark-results.md](../benchmark-results.md) |
| Documented gaps in rules 01–08 | Not started |
| Taint mode for Rules 01 and 05 | Not started |
| Release v0.3.0 | Not started |

## Testing and validation

| Step | Result |
|---|---|
| `scripts/run-tests.sh` | `All 14 rule files passed.` |
| `scripts/check-examples.sh` | 28 `PASS` lines |
| New-rule fixtures before each rule existed (stub rule) | Failed as expected for both |

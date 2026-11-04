# Milestone 5: v0.2.0 rules and code scanning

## Milestone metadata

- Milestone number: 5
- Started: 2026-11-04
- Status: In progress
- Related pull requests: [#10](https://github.com/Hemanth2709/SentinelRules/pull/10)

## Objective

Make findings visible in GitHub code scanning, make the pack reusable as an
Action, and add rules for the three planted benchmark cases that had no rule
(SSRF, open redirect, mass assignment), plus `eval` on request data.

## Planned work

| Task | State |
|---|---|
| Composite GitHub Action (`action.yml`) with `fail-on` threshold | Done |
| SARIF post-processing (stable IDs, `security-severity`) and upload | Done – DEC-009 |
| Code scanning workflow with action self-test | Done – first real run on PR #10 ([run](https://github.com/Hemanth2709/SentinelRules/actions/runs/41773236491)): SARIF upload and self-test passed. After the rules commit, GitHub's PR code scanning check failed on the 5 intended alerts in the new vulnerable examples, so the upload now runs on `main` only |
| Rule 09: SSRF (taint) | Done – 8 `ruleid`, 6 `ok` |
| Rule 10: Open redirect (taint) | Done – 7 `ruleid`, 6 `ok` |
| Rule 11: Mass assignment (taint) | Done – 7 `ruleid`, 5 `ok` |
| Rule 12: Code injection (taint) | Done – 6 `ruleid`, 4 `ok` |
| Ground-truth benchmark extended (8 new cases, predictions first) | Done – 74% precision, 67% recall (20/30), no differences from predictions; see [benchmark-results.md](../benchmark-results.md) |
| Missing Helmet, `next.config` image `remotePatterns` | Not started |
| Release v0.2.0 | Not started – created from the GitHub UI after merge |

## Testing and validation

| Step | Result |
|---|---|
| `semgrep --validate --config rules/` | Pass |
| `scripts/run-tests.sh` | `All 12 rule files passed.` |
| `scripts/check-examples.sh` | 24 `PASS` lines |
| New-rule fixtures before each rule existed (stub rule) | Failed as expected for all four (missed lines recorded in each implementation log) |

Failures during development, with causes and fixes, are in each feature's
`implementation-log.md` (09–12).

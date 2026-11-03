# Milestone 4: Benchmark and release

## Milestone metadata

- Milestone number: 4
- Planned deadline: 2026-11-21
- Actual completion date: 2026-11-02
- Status: Complete
- Related Git commits: see [Commits](#commits)
- Related pull requests: [#6](https://github.com/Hemanth2709/SentinelRules/pull/6), [#7](https://github.com/Hemanth2709/SentinelRules/pull/7), [HemanthG#4](https://github.com/Hemanth2709/HemanthG/pull/4)

## Objective

Validate the pack on a real application, document the results honestly, and
publish the repository.

## Planned work

| Task | State |
|---|---|
| Final README | Done |
| Rule → CWE → OWASP mapping | Done – [security-mappings.md](../security-mappings.md) |
| Vulnerable and secure examples | Done – `examples/` |
| False-positive documentation | Done – [false-positives.md](../false-positives.md), including benchmark observations |
| Benchmark methodology | Done – [benchmark-methodology.md](../benchmark-methodology.md) |
| Application scan (authorized) | Done – private identity provider (runs 1, 1b; details withheld, employer project), Event-Booking-NEST-JS (run 2), HemanthG portfolio (run 3) |
| Benchmark report | Done – [benchmark-results.md](../benchmark-results.md): 3 applications, latest runs 3 findings, 0 TP, precision 0% |
| Public release | Done – repository is public; [v0.1.0](https://github.com/Hemanth2709/SentinelRules/releases/tag/v0.1.0) published 2026-11-02 on `8cd2a50` (rules, tests and scripts identical to release-prep commit `b6e304d`). Verified by cloning the tag: 8/8 rule files, 16/16 examples |
| Evidence of successful CI | Done – [run #3](https://github.com/Hemanth2709/SentinelRules/actions/runs/40168233347) on `main` |
| Integration into portfolio application CI (W6) | Done – [Hemanth2709/HemanthG#4](https://github.com/Hemanth2709/HemanthG/pull/4) adds a workflow running the rule pack (pinned to `b6e304d`) on every push and PR; [scan on `main`](https://github.com/Hemanth2709/HemanthG/actions/runs/41470871160) passed with 0 findings |

## Implementation record

Documentation deliverables above were written on 2026-10-25 alongside the
rules.

## Testing and validation

| Step | Result |
|---|---|
| Benchmark run 1 (private identity provider) | 8 findings, 0 TP, 8 FP, precision 0% |
| Rule fix (Server Action async) | Regression fixture failed before, passes after; 10/10 tests, 16/16 examples |
| Re-scan after fix (run 1b) | 1 finding (the global-guard FP), as expected |
| Benchmark run 2 (Event-Booking-NEST-JS, `5c521fd`) | 1 finding, FP (public hello route) |
| Benchmark run 3 (HemanthG, `c0d7ad5`) | 1 finding, FP (JSON-LD from static data) |
| Rule fix (escaped JSON-LD accepted) | New `ok` fixture failed before, passes after; 8/8 rule files, 16/16 examples |
| Portfolio CI integration | Scan with pinned rules: 1 finding (exit 1) before escaping the portfolio's JSON-LD, 0 findings (exit 0) after; `next build` and `tsc --noEmit` pass; CI green on the PR and on `main` |

## Learning notes

See the benchmark section of
[lessons-learned.md](../learning-notes/lessons-learned.md).

## Decisions

- [DEC-008](../decisions/decision-log.md): details of private projects scanned
  for the benchmark are generalised in public documentation.

## Known limitations

Three applications have been scanned. Only two rule IDs produced findings,
all false positives, so real-world precision is 0% on a very small sample and
eight rule IDs have no real-world observations. Recall is unknown. The scanned
applications contain little code of the kinds most rules target (cookies,
CORS, raw SQL, JWT verification).

## Completion review

- [x] All required tasks are implemented.
- [x] All required tests pass.
- [x] Documentation is updated.
- [x] Relevant implementation logs are updated.
- [x] Acceptance criteria are satisfied.
- [x] Remaining limitations are recorded.

## Commits

- `b3bd36f` – Benchmark runs 2–3, escaped JSON-LD fix, CI action bump, v0.1.0 prep (merged as `b6e304d`)
- `cda9ac1` – Record portfolio CI integration; correct release status (merged as `8cd2a50`, tagged `v0.1.0`)

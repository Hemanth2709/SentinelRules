# Milestone 4: Benchmark and release

## Milestone metadata

- Milestone number: 4
- Planned deadline: 2026-11-21
- Actual completion date: –
- Status: In progress
- Related Git commits: see [Commits](#commits)
- Related pull requests: none yet

## Objective

Validate the pack on a real application, document the results honestly, and
publish the repository.

## Planned work

| Task | State |
|---|---|
| Final README | Drafted |
| Rule → CWE → OWASP mapping | Done – [security-mappings.md](../security-mappings.md) |
| Vulnerable and secure examples | Done – `examples/` |
| False-positive documentation | Done from development observations – [false-positives.md](../false-positives.md); benchmark observations pending |
| Benchmark methodology | Done – [benchmark-methodology.md](../benchmark-methodology.md) |
| Application scan (authorized) | Run 1 done on IdentityProvider (2026-10-25); permission basis and commit SHA still to be recorded |
| Benchmark report | Runs 1 and 1b recorded – [benchmark-results.md](../benchmark-results.md) |
| Public release | **Pending** |
| Evidence of successful CI | Done – [run #3](https://github.com/Hemanth2709/SentinelRules/actions/runs/40168233347) on `main` |
| Integration into portfolio application CI (W6) | **Pending** |

## Implementation record

Documentation deliverables above were written on 2026-10-25 alongside the
rules.

## Testing and validation

| Step | Result |
|---|---|
| Benchmark run 1 (IdentityProvider) | 8 findings, 0 TP, 8 FP, precision 0% |
| Rule fix (Server Action async) | Regression fixture failed before, passes after; 10/10 tests, 16/16 examples |
| Re-scan after fix (run 1b) | 1 finding (the global-guard FP), as expected |

## Learning notes

See the benchmark section of
[lessons-learned.md](../learning-notes/lessons-learned.md).

## Decisions

None yet.

## Known limitations

Only one application has been scanned, and only the authorization rules
produced findings, so the other eight rule IDs have no real-world precision
data. Recall is unknown.

## Completion review

- [ ] All required tasks are implemented.
- [ ] All required tests pass.
- [ ] Documentation is updated.
- [ ] Relevant implementation logs are updated.
- [ ] Acceptance criteria are satisfied.
- [ ] Remaining limitations are recorded.

## Commits

To be recorded after push.

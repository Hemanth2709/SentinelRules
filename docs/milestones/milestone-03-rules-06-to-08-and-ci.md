# Milestone 3: Rules 06–08 and CI

## Milestone metadata

- Milestone number: 3
- Planned deadline: 2026-11-15
- Actual completion date: 2026-10-25
- Status: Complete
- Related Git commits: see [Commits](#commits)
- Related pull requests: [#1](https://github.com/Hemanth2709/SentinelRules/pull/1)

## Objective

Complete the eight-feature pack with cookie, CORS, and authorization rules,
and automate testing in GitHub Actions.

## Planned work

| Task | Acceptance criterion | State |
|---|---|---|
| Insecure-cookie rule | Missing attributes detected; secure cookies not flagged | Done |
| CORS rule | `origin: true` / reflected origin with credentials detected; allowlists not flagged | Done |
| Missing-authorization heuristic | Unguarded routes / handlers flagged; visible protection not flagged | Done |
| Tests | ≥ 2 positive and ≥ 2 negative per rule | Done |
| GitHub Actions workflow | Runs on push and pull request; fails on test failure | Done – ran on push and on PR #1 |
| CI passing on default branch | Green run on the default branch | Done – [run #3](https://github.com/Hemanth2709/SentinelRules/actions/runs/40168233347) on `main` |

## Implementation record

- **Cookies** – One rule ID covering Express/NestJS `res.cookie`, Next.js
  `cookies().set`, and `NextResponse` cookies; limited to session-like
  literal names. Secure = `httpOnly: true` + `secure` not false + `sameSite`
  present.
- **CORS** – Object-literal patterns for `origin: true`, allow-all and echo
  callbacks; statement-sequence pattern for manually reflected headers.
- **Authorization** – Two rule IDs: NestJS routes without `@UseGuards` /
  `@Public()`; Next.js mutating route handlers and Server Actions without a
  recognised auth helper. Presented as review candidates.
- **CI** – `.github/workflows/semgrep-tests.yml`: validate, test (with
  zero-test guard), example check, job summary.

## Testing and validation

| Command | Result |
|---|---|
| `semgrep --test --config rules/ tests/` | `10/10: ✓ All tests passed` (2026-10-25) |
| `semgrep --validate --config rules/` | exit 0 |
| `scripts/check-examples.sh` | 16/16 PASS |
| Mutation: one CORS `ok` annotation changed to `ruleid` in a scratch copy | `semgrep --test` exit 1 (shows CI would fail) |
| GitHub Actions, branch push | [run #1](https://github.com/Hemanth2709/SentinelRules/actions/runs/40167509704) – success |
| GitHub Actions, PR #1 | [PR run](https://github.com/Hemanth2709/SentinelRules/actions/runs/40167653635) – success |
| GitHub Actions, `main` after merge | [run #3](https://github.com/Hemanth2709/SentinelRules/actions/runs/40168233347) – success |

Note: run #3 ran on merge commit `0a4c45e`. `main` history was later
rewritten to re-author the commits (same files apart from the commit ID in the
milestone logs); the rewritten head is `2763d51`.

Failures encountered and resolved: cookie rule validation error ("cannot
negate in an Or"); CORS annotation placement; authorization `$PUBLIC`
metavariable error; `function` vs `export function` negation mismatch.

## Learning notes

- Negative patterns must mirror the positive pattern's syntactic form.
- GitHub's default `run` shell lacks `pipefail`; `cmd | tee` would hide
  failures.

## Decisions

DEC-006.

## Known limitations

See limitations for rules [06](../features/06-insecure-cookies/limitations.md),
[07](../features/07-cors-misconfiguration/limitations.md),
[08](../features/08-missing-authorization/limitations.md).

## Completion review

- [x] All required tasks are implemented.
- [x] All required tests pass.
- [x] Documentation is updated.
- [x] Relevant implementation logs are updated.
- [x] Acceptance criteria are satisfied.
- [x] Remaining limitations are recorded.

## Commits

- `2763d51` – Merge pull request #1 (rewritten merge commit on `main`)
- `0977c6e` – Add Sentinel Rules pack: 8 Semgrep rule features, tests, CI and docs (branch `claude/zealous-franklin-4fgini`)

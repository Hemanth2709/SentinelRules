# Milestone 3: Rules 06–08 and CI

## Milestone metadata

- Milestone number: 3
- Planned deadline: 2026-11-15
- Actual completion date: –
- Status: In progress
- Related Git commits: see [Commits](#commits)
- Related pull requests: none yet

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
| GitHub Actions workflow | Runs on push and pull request; fails on test failure | Written, not yet run on GitHub |
| CI passing on default branch | Green run on the default branch | **Pending** – work is on a feature branch |

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
| GitHub Actions run | Not yet available |

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
- [x] All required tests pass (locally).
- [x] Documentation is updated.
- [x] Relevant implementation logs are updated.
- [ ] Acceptance criteria are satisfied (CI on default branch pending).
- [x] Remaining limitations are recorded.

## Commits

To be recorded after push.

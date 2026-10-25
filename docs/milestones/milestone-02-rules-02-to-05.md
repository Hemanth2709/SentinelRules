# Milestone 2: Rules 02–05

## Milestone metadata

- Milestone number: 2
- Planned deadline: 2026-11-08
- Actual completion date: 2026-10-25
- Status: Complete
- Related Git commits: see [Commits](#commits)
- Related pull requests: none yet

## Objective

Extend the pack to configuration and client-side issues: JWT verification,
NestJS input whitelisting, public secrets, and unsafe HTML.

## Planned work

| Task | Acceptance criterion |
|---|---|
| JWT rule | `ignoreExpiration: true` detected; algorithm configuration tested |
| ValidationPipe rule | Missing whitelist detected; whitelisted config not flagged |
| Public-secret rule | Clear credential names detected; public identifiers not flagged |
| Unsafe HTML rule | Dynamic HTML detected; static and sanitized cases not flagged |
| Tests | ≥ 2 positive and ≥ 2 negative per rule |
| Documentation | Feature folders 02–05 |
| Regression | SQL injection tests still pass |

## Implementation record

- **JWT** – Two rule IDs (DEC-004): `sentinel-jwt-ignore-expiration`
  (ERROR, HIGH) and `sentinel-jwt-verify-missing-algorithms` (WARNING, LOW,
  scoped to `jsonwebtoken` imports). Spread options excluded after an ad-hoc
  probe showed a false positive.
- **ValidationPipe** – Constructor-based matching covers global, controller,
  method, and parameter pipes; `APP_PIPE` + `useClass` included. Spread
  options excluded.
- **Public secrets** – Name-based with a deliberately narrow indicator list
  and an exclusion for `PUBLISHABLE`, `PUBLIC_KEY`, `ANON_KEY` (DEC-005).
- **Unsafe HTML** – Matches `{ __html: $X }` so both JSX and
  `createElement` are covered; excludes literals and recognised sanitizers.

## Testing and validation

| Command | Result |
|---|---|
| `semgrep --test --config rules/ tests/` | `10/10: ✓ All tests passed` (whole pack, final run 2026-10-25) |
| `scripts/check-examples.sh` | 16/16 PASS |

Failures encountered and resolved:

- JWT finding reported on the object's first line → `focus-metavariable`.
- Unsafe HTML JSX-comment annotation not read → fixture restructured.
- Spread false positives (JWT, ValidationPipe) → exclusions + fixtures.

## Learning notes

- Object patterns are order-independent, which makes configuration rules
  concise.
- Name-based secret detection has to choose between noise and coverage;
  documented in Rule 04's limitations.

## Decisions

DEC-004, DEC-005.

## Known limitations

See limitations for rules [02](../features/02-jwt-misconfiguration/limitations.md),
[03](../features/03-validation-pipe/limitations.md),
[04](../features/04-next-public-secrets/limitations.md),
[05](../features/05-unsafe-html/limitations.md).

## Completion review

- [x] All required tasks are implemented.
- [x] All required tests pass.
- [x] Documentation is updated.
- [x] Relevant implementation logs are updated.
- [x] Acceptance criteria are satisfied.
- [x] Remaining limitations are recorded.

## Commits

- `0977c6e` – Add Sentinel Rules pack: 8 Semgrep rule features, tests, CI and docs (branch `claude/zealous-franklin-4fgini`)

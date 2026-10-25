# Testing guide

## Fixture conventions

- One fixture per rule file, with the same base name:
  `rules/sql-injection.yml` ↔ `tests/sql-injection.ts`.
- `// ruleid: <rule-id>` – the **next line** must produce a finding for that
  rule.
- `// ok: <rule-id>` – the next line must not.
- Each rule ID has at least two `ruleid` and two `ok` annotations, covering
  different variations (not the same expression copied).
- Fixtures are type-plausible TypeScript but are not compiled; use `declare`
  for external values.

## Commands

```bash
# All rules
semgrep --test --config rules/ tests/

# One rule file
semgrep --test --config rules/cors-misconfiguration.yml tests/cors-misconfiguration.ts

# Syntax / schema validation
semgrep --validate --config rules/

# Realistic examples
scripts/check-examples.sh
```

### Why not `semgrep --test rules/`?

That form expects fixtures *next to* the rules. With this repository's
`rules/` + `tests/` layout it finds no fixtures, prints
`No unit tests found`, and **exits 0**. CI therefore runs the two-directory
form and fails if that message appears. See DEC-003 in the
[decision log](decisions/decision-log.md).

## Regression procedure

When a rule changes:

1. Run its own test.
2. Run the whole suite.
3. Scan the fixture directly and check for unexpected or duplicate findings.
4. Run `scripts/check-examples.sh`.
5. Update the feature's `testing-notes.md` and `implementation-log.md`.
6. Update the milestone log if a deliverable is affected.

Never weaken a negative test to make an inaccurate rule pass.

## Current results

| Date | Semgrep | Command | Result |
|---|---|---|---|
| 2026-10-25 | 1.180.0 | `semgrep --test --config rules/ tests/` | `10/10: ✓ All tests passed` |
| 2026-10-25 | 1.180.0 | `scripts/check-examples.sh` | 16/16 PASS |

Fixture totals: 38 `ruleid` and 44 `ok` annotations across 10 rule IDs.

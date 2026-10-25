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
# All rules, one rule file at a time (recommended, works on Windows)
scripts/run-tests.sh

# All rules in one Semgrep call (Linux/macOS only, see below)
semgrep --test --config rules/ tests/

# One rule file
semgrep --test --config rules/cors-misconfiguration.yml tests/cors-misconfiguration.ts

# Syntax / schema validation
semgrep --validate --config rules/

# Realistic examples
scripts/check-examples.sh
```

### Windows: `PermissionError ... .semgrep\settings.yml`

`semgrep --test --config rules/ tests/` checks several rule files at the same
time. Every check rewrites Semgrep's settings file (`~/.semgrep/settings.yml`),
and on Windows those overlapping rewrites fail with `PermissionError`. The
affected rule files are then **not tested** although the summary for the
others still says "All tests passed". This was observed on Windows with Git
Bash, Python 3.14 and Semgrep 1.180.0 on 2026-10-25: 6 of 10 rule IDs ran,
three rule files raised the error.

`scripts/run-tests.sh` avoids this by running each rule file in its own
Semgrep process with a private settings file (`SEMGREP_SETTINGS_FILE`). Use it
on every platform; CI uses it too.

### Why not `semgrep --test rules/`?

That form expects fixtures *next to* the rules. With this repository's
`rules/` + `tests/` layout it finds no fixtures, prints
`No unit tests found`, and **exits 0**. CI therefore runs the two-directory
form and fails if that message appears. See DEC-003 in the
[decision log](decisions/decision-log.md).

## Regression procedure

When a rule changes:

1. Run its own test.
2. Run the whole suite (`scripts/run-tests.sh`).
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
| 2026-10-25 | 1.180.0 | Both, after the Server Action async fix | 10/10 tests, 16/16 examples |
| 2026-10-25 | 1.180.0 | `scripts/run-tests.sh` (Linux) | 8/8 rule files, 10 rule IDs |

Fixture totals: 38 `ruleid` and 45 `ok` annotations across 10 rule IDs.

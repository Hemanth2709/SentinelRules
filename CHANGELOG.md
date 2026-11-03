# Changelog

All notable changes are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.1.1] - 2026-11-03

### Fixed

- `sentinel-sql-injection-raw-query` now tracks `sql += ...` inside
  `if`/`else` branches and `for`/`while` loops, with or without braces. These
  were previously missed (found by the ground-truth benchmark, case V-02).
- `sentinel-sql-injection-raw-query` recognises appended clauses starting
  with `OR <column> =` as SQL.

### Added

- Ground-truth benchmark results (26 planted vulnerabilities, 20 safe
  look-alikes) in `docs/benchmark-results.md`.
- `AGENTS.md` briefing for AI coding assistants.

### Changed

- Benchmark documentation no longer names the private project scanned in
  runs 1/1b or its internal files and functions (DEC-008).

## [0.1.0] - 2026-11-02

First release.

### Fixed

- `sentinel-react-dangerously-set-inner-html` accepts JSON-LD escaped as
  `JSON.stringify(...).replace(/</g, ...)` (benchmark run 3); the
  first-occurrence-only `.replace('<', ...)` is still reported.
- CI uses `actions/checkout@v5` and `actions/setup-python@v6` (removes the
  Node.js 20 deprecation warning).
- Tests could silently skip rule files on Windows (`PermissionError` on
  `~/.semgrep/settings.yml`). New `scripts/run-tests.sh` runs one rule file
  at a time with a private settings file; CI and docs use it.
- `scripts/check-examples.sh` now works where only `python` (not `python3`)
  is installed, as in Git Bash on Windows.
- `sentinel-nextjs-handler-missing-auth-check` no longer treats non-async
  exports in a `'use server'` module as Server Actions (7 false positives in
  benchmark run 1).

### Added

- Benchmark runs 1, 1b, 2 and 3 (a private identity provider,
  Event-Booking-NEST-JS, HemanthG).

- Eight rule features (ten rule IDs) in `rules/`: SQL injection, JWT
  misconfiguration (two IDs), ValidationPipe whitelist, `NEXT_PUBLIC_`
  secrets, unsafe `dangerouslySetInnerHTML`, insecure session cookies,
  credentialed CORS with any origin, and missing-authorization heuristics for
  NestJS and Next.js (two IDs).
- Annotated fixtures in `tests/` (40 `ruleid`, 46 `ok`).
- Vulnerable and secure examples in `examples/` and
  `scripts/check-examples.sh`.
- GitHub Actions workflow running validation, fixtures, and example checks
  with Semgrep 1.180.0.
- Documentation: guides, per-feature docs, security mappings, benchmark
  methodology, decision log, milestone logs, learning notes.

[Unreleased]: https://github.com/Hemanth2709/SentinelRules/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/Hemanth2709/SentinelRules/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Hemanth2709/SentinelRules/releases/tag/v0.1.0

# Changelog

All notable changes are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Fixed

- Tests could silently skip rule files on Windows (`PermissionError` on
  `~/.semgrep/settings.yml`). New `scripts/run-tests.sh` runs one rule file
  at a time with a private settings file; CI and docs use it.
- `scripts/check-examples.sh` now works where only `python` (not `python3`)
  is installed, as in Git Bash on Windows.
- `sentinel-nextjs-handler-missing-auth-check` no longer treats non-async
  exports in a `'use server'` module as Server Actions (7 false positives in
  benchmark run 1).

### Added

- Benchmark run 1 results (IdentityProvider).

- Eight rule features (ten rule IDs) in `rules/`: SQL injection, JWT
  misconfiguration (two IDs), ValidationPipe whitelist, `NEXT_PUBLIC_`
  secrets, unsafe `dangerouslySetInnerHTML`, insecure session cookies,
  credentialed CORS with any origin, and missing-authorization heuristics for
  NestJS and Next.js (two IDs).
- Annotated fixtures in `tests/` (38 `ruleid`, 45 `ok`).
- Vulnerable and secure examples in `examples/` and
  `scripts/check-examples.sh`.
- GitHub Actions workflow running validation, fixtures, and example checks
  with Semgrep 1.180.0.
- Documentation: guides, per-feature docs, security mappings, benchmark
  methodology, decision log, milestone logs, learning notes.

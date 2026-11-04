# Changelog

All notable changes are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.3.0] - 2026-11-04

### Added
- `sentinel-missing-helmet` (CWE-693/1021, A05, audit): a NestJS or Express
  app that calls `listen()` without registering `helmet()` (or
  `@fastify/helmet`) earlier in the same function.
- `sentinel-next-image-wildcard-remote-pattern` (CWE-918/400, A05/A10):
  `images.remotePatterns` entries in a Next.js config that allow any host
  (`'*'`, `'**'`, or `new URL('https://**/...')`).

- `sentinel-sql-injection-tainted-query` (CWE-89, A03, taint): request data
  reaching raw SQL through variables, string building or helpers in other
  modules, including Prisma `Prisma.raw()`, Sequelize `literal()`, knex
  `*Raw` helpers and TypeORM query-builder conditions and ordering.
- `sentinel-dom-html-sink-user-input` (CWE-79, A03, taint): URL, referrer,
  `useSearchParams()` or request data written to `innerHTML`, `outerHTML`,
  `insertAdjacentHTML`, `document.write`, or an HTML response.
- `sentinel-jwt-decode-without-verify` (CWE-347/345, A07/A02/A08, audit):
  `jsonwebtoken` `decode()` in a function that never verifies the token.
- `sentinel-cors-weak-origin-check` (CWE-346/942, A05/A01): origin checks
  that attacker-registered origins pass (`endsWith`/`includes` without a
  leading dot, host-only `startsWith`, unanchored regexes).

### Changed
- `sentinel-sql-injection-raw-query`: also follows SQL returned by a helper
  function declared in the same file.
- `sentinel-next-public-secret-env`: also matches destructuring from
  `process.env`, and keys or tokens named after providers that issue no
  browser-safe keys (OpenAI, Anthropic, GitHub tokens and others).
- `sentinel-insecure-session-cookie`: also judges options taken from a
  `const` object literal declared earlier in the same file or function.
- `sentinel-cors-credentials-any-origin`: also covers Web Fetch API headers
  (`response.headers.set(...)`) reflecting the request Origin with
  credentials.
- The secure CORS and ValidationPipe examples now register `helmet()`; the
  new rule correctly flagged both.

### Benchmark
- Ground-truth app extended to 37 planted vulnerabilities and 30 safe
  look-alikes. On the same app commit: 80% precision and 89% recall (33/37)
  for these changes, against 75% and 65% (24/37) for the rules before them.
  All nine new detections were predicted before the scan, and there were no
  new false positives.

## [0.2.0] - 2026-11-04

### Added
- Four taint-mode rules (DEC-010), each with fixtures, vulnerable and secure
  examples, and seven feature documents:
  - `sentinel-ssrf-user-controlled-url` (CWE-918, A10): request data used as
    the URL of `fetch`, `axios`, `got`, `http(s)` or NestJS `HttpService`.
  - `sentinel-open-redirect-user-controlled-url` (CWE-601, A01): request data
    used as a redirect target (`NextResponse.redirect`, `redirect()`,
    `res.redirect`, `@Redirect()` handlers).
  - `sentinel-mass-assignment-unfiltered-body` (CWE-915, A08/A01): a whole
    request body written or spread into Prisma, TypeORM, Sequelize or
    Mongoose writes, or `Object.assign`.
  - `sentinel-code-injection-eval-user-input` (CWE-95/94, A03): request data
    executed with `eval`, `Function`, string `setTimeout`/`setInterval` or
    `node:vm`.
- Composite GitHub Action (`action.yml`): scans with the pack, writes SARIF,
  optionally uploads it to GitHub code scanning, and fails at a chosen level
  (`fail-on: error | warning | none`).
- `scripts/sarif-postprocess.py`: stable `sentinel-…` rule IDs, a
  `security-severity` per rule (ERROR → High, WARNING → Medium), and the tool
  reported as "Sentinel Rules".
- `code-scanning.yml` workflow: uploads findings for `examples/vulnerable` to
  this repository's code scanning from `main`, and self-tests the action's
  threshold on every push and pull request.

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

[Unreleased]: https://github.com/Hemanth2709/SentinelRules/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/Hemanth2709/SentinelRules/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Hemanth2709/SentinelRules/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/Hemanth2709/SentinelRules/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Hemanth2709/SentinelRules/releases/tag/v0.1.0

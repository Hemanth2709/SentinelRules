# AGENTS.md: project briefing for AI coding assistants

This file briefs an AI assistant (Codex, ChatGPT, Claude or similar) on
**Sentinel Rules**: what it is, what has been built, how to work on it, and
what comes next. Read it fully before changing anything.

---

## 1. What this project is

Sentinel Rules is an open-source pack of custom [Semgrep](https://semgrep.dev)
rules that detect common security weaknesses in **NestJS** and **Next.js**
applications written in TypeScript/JavaScript.

- **Owner:** Hemanth G ([@Hemanth2709](https://github.com/Hemanth2709))
- **Repository:** https://github.com/Hemanth2709/SentinelRules (public)
- **Latest release:** [v0.3.0](https://github.com/Hemanth2709/SentinelRules/releases/tag/v0.3.0) (2026-11-04, commit `b946320`): rules 13–14, gap fixes in rules 01–07, taint mode for SQL injection and HTML (20 rule IDs). Previous: [v0.2.0](https://github.com/Hemanth2709/SentinelRules/releases/tag/v0.2.0) (2026-11-04, commit `3b00ec6`): GitHub Action, code scanning, rules 09–12; v0.1.1 (2026-11-03): SQL `+=` fix from the ground-truth benchmark; [v0.1.0](https://github.com/Hemanth2709/SentinelRules/releases/tag/v0.1.0) (2026-11-02, commit `8cd2a50`)
- **License:** MIT

### Why it exists
1. **Practical goal:** catch framework-specific security mistakes that
   general-purpose scanners tend to miss, for example `ValidationPipe`
   without `whitelist`, secrets in `NEXT_PUBLIC_*` variables, or credentialed
   CORS that trusts any origin. Checks run automatically in CI.
2. **Portfolio goal:** demonstrate application-security engineering end to
   end. That means turning vulnerabilities into detection rules, testing both
   what rules catch and what they must ignore, measuring them on real code,
   automating them in CI, and documenting everything honestly.

### What it is not (out of scope)
A new analysis engine, a SAST platform or dashboard, a rule editor, runtime
protection, an automated code-fixing engine, support for other languages, or
anything claiming to *prove* authorization is correct.

---

## 2. Current status (as of 2026-11-04, after v0.3.0)

| Milestone | Deadline | Status |
|---|---|---|
| 1. Repository and first rule | 2026-10-31 | Complete |
| 2. Rules 02–05 | 2026-11-08 | Complete |
| 3. Rules 06–08 and CI | 2026-11-15 | Complete |
| 4. Benchmark and release | 2026-11-21 | Complete |

- **Rules:** 16 rule files containing 20 rule IDs, all released in v0.3.0.
- **Tests:** 114 `ruleid` (must flag) and 107 `ok` (must not flag)
  annotations, all passing with Semgrep 1.180.0.
- **CI:** green on `main` (GitHub Actions, Linux). The tests have also been
  verified on Windows (Git Bash, Python 3.14).
- **Ground-truth benchmark:** a deliberately vulnerable NestJS + Next.js app
  (separate private repo `Hemanth2709/special-umbrella`), now with 30 planted
  vulnerabilities and 24 safe look-alikes in v0.2.0, now 37 and 30. v0.3.0
  reaches **80% precision and 89% recall** over all 37 (v0.2.0
  reached 74% and 67% over 30). Score it with `scripts/score.py` in that
  repo.
- **Real applications:** 3 scanned. Latest runs found 3 findings, all false
  positives. Three rule bugs found by the benchmarks were fixed with
  regression tests. **Biggest weakness:** no true positives on real code
  yet, and the authorization heuristics produce the false positives.
- **Integration:** the owner's portfolio site
  ([Hemanth2709/HemanthG](https://github.com/Hemanth2709/HemanthG)) runs this
  rule pack in its CI on every push (workflow
  `.github/workflows/sentinel-rules.yml`, pinned to commit `b6e304d`).

---

## 3. Rule catalogue

| # | Feature | Rule ID | Severity | Detects |
|---|---|---|---|---|
| 01 | SQL injection (taint, v0.3.0) | `sentinel-sql-injection-tainted-query` | ERROR | Request data reaching raw SQL through variables, string building or helpers in other modules; also Prisma.raw, Sequelize `literal`, knex `*Raw`, TypeORM query-builder fragments. Skips SQL built directly in the call (the rule below reports it). |
| 01 | SQL injection | `sentinel-sql-injection-raw-query` | ERROR | `$queryRawUnsafe`, `$executeRawUnsafe`, `.query`, `.raw`, `.execute` called with SQL built by interpolation, `+` or `.concat`, including SQL built in a local variable first, or returned by a helper function in the same file (v0.3.0). The SQL-keyword check keeps out non-SQL `.query()` calls. |
| 02 | JWT | `sentinel-jwt-ignore-expiration` | ERROR | Any object literal with `ignoreExpiration: true`. |
| 02 | JWT | `sentinel-jwt-verify-missing-algorithms` | WARNING | `jsonwebtoken` `verify()` without an `algorithms` allowlist. Spread or variable options are not judged. |
| 02 | JWT (v0.3.0) | `sentinel-jwt-decode-without-verify` | WARNING | `jsonwebtoken` `decode()` in a function with no `verify()`/`verifyAsync()` call. |
| 03 | ValidationPipe | `sentinel-nestjs-validation-pipe-missing-whitelist` | WARNING | `new ValidationPipe()` or `APP_PIPE useClass: ValidationPipe` without `whitelist: true`. |
| 04 | Public secrets | `sentinel-next-public-secret-env` | ERROR | A `NEXT_PUBLIC_*` name containing SECRET, PRIVATE, PASSWORD, SERVICE_ROLE, DATABASE_URL and similar. Excludes PUBLISHABLE, PUBLIC_KEY and ANON_KEY. Since v0.3.0 also destructuring from `process.env` and keys/tokens of providers with no browser-safe keys (OpenAI, Anthropic, GitHub tokens, ...). |
| 05 | Unsafe HTML | `sentinel-react-dangerously-set-inner-html` | WARNING | `{__html: dynamic}` that is not sanitized. Accepts DOMPurify/sanitize-html and escaped JSON-LD `JSON.stringify(x).replace(/</g, ...)`. |
| 05 | DOM and HTML sinks (taint, v0.3.0) | `sentinel-dom-html-sink-user-input` | WARNING | URL/referrer/`useSearchParams()` or request data into `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, Express string responses or `text/html` Responses. |
| 06 | Cookies | `sentinel-insecure-session-cookie` | WARNING | A session-like cookie set without `httpOnly: true`, `secure` (not false) and `sameSite`. Covers `res.cookie`, `cookies().set` and `response.cookies.set`, with inline options or (v0.3.0) a `const` object declared earlier in the same file. |
| 07 | CORS | `sentinel-cors-credentials-any-origin` | ERROR | `origin: true`, or an always-allow/echo origin callback, combined with `credentials: true`, or a reflected `Origin` header plus `Allow-Credentials` (Express, or Fetch API `headers.set` since v0.3.0). |
| 07 | CORS (v0.3.0) | `sentinel-cors-weak-origin-check` | WARNING | `origin.endsWith`/`includes` without a leading dot, host-only `startsWith`, or a regex not anchored at both ends. |
| 08 | Authorization (heuristic) | `sentinel-nestjs-route-missing-guard` | WARNING | A NestJS route with no `@UseGuards` on the method or class and no `@Public()`/`@SkipAuth()`/`@AllowAnonymous()`. |
| 08 | Authorization (heuristic) | `sentinel-nextjs-handler-missing-auth-check` | WARNING | `POST`/`PUT`/`PATCH`/`DELETE` route handlers and `export async function` Server Actions with no recognised auth call (`getServerSession`, `auth`, `getToken`, `currentUser`, `*.auth.getUser`, ...). |
| 09 | SSRF (taint) | `sentinel-ssrf-user-controlled-url` | WARNING | Request data reaching the URL of `fetch`, `axios`, `got`, `http(s)` or `this.httpService`. Sanitized by allowlist-named checks, constant maps, `encodeURIComponent`, fixed `https://host/` templates. |
| 10 | Open redirect (taint) | `sentinel-open-redirect-user-controlled-url` | WARNING | Request data reaching `NextResponse.redirect`, `redirect()`, `Response.redirect`, `res.redirect` or `{ url }` from `@Redirect()`. |
| 11 | Mass assignment (taint) | `sentinel-mass-assignment-unfiltered-body` | WARNING | A whole request body (or a spread of it) as the value of a Prisma/TypeORM/Sequelize/Mongoose write or `Object.assign`. Picked fields are never a sink; schema `.parse()` sanitizes. |
| 12 | Code injection (taint) | `sentinel-code-injection-eval-user-input` | ERROR | Request data reaching `eval`, `Function`, string `setTimeout`/`setInterval` or `node:vm`. |
| 13 | Missing Helmet (audit) | `sentinel-missing-helmet` | WARNING | `NestFactory.create`/`express()` app calling `listen()` with no earlier `app.use(helmet())` or `register(helmet / fastifyHelmet)` in the same function. |
| 14 | Image remotePatterns | `sentinel-next-image-wildcard-remote-pattern` | WARNING | `images.remotePatterns` entry with hostname `'*'`/`'**'` or `new URL('https://**/...')`. |

Each rule has CWE and OWASP Top 10 (2021) metadata, references, and a
`documentation` link to `docs/features/NN-name/`.

---

## 4. Repository layout

```
rules/<name>.yml           Semgrep rules (one file per feature; may hold several rule IDs)
tests/<name>.ts|tsx        Annotated fixtures, paired with rules by base name
examples/vulnerable/       Realistic vulnerable code, one file per feature
examples/secure/           The corrected version of each vulnerable example
scripts/run-tests.sh       Runs fixtures one rule file at a time (works on Windows)
scripts/check-examples.sh  Each rule must flag its vulnerable example and not its secure one
.github/workflows/semgrep-tests.yml   CI: validate, run-tests, check-examples, job summary
.github/workflows/code-scanning.yml   SARIF upload of examples/vulnerable; action self-test
action.yml                 Composite GitHub Action (scan, SARIF, threshold, upload)
scripts/sarif-postprocess.py          Stable rule IDs, security-severity, fail-on threshold
docs/features/NN-name/     7 docs per rule: README, vulnerability-explanation,
                           detection-logic, remediation, testing-notes,
                           limitations, implementation-log
docs/benchmark-*.md        Methodology and results of real-app scans
docs/decisions/decision-log.md        DEC-001 … DEC-010 (design decisions)
docs/milestones/           One log per milestone
docs/learning-notes/       Concepts and lessons learned
CHANGELOG.md               Keep a Changelog format
```

---

## 5. Commands

```bash
pip install semgrep==1.180.0          # pinned version, used by CI and docs

semgrep --validate --config rules/    # rule syntax/schema
scripts/run-tests.sh                  # all fixtures, one rule file at a time
scripts/check-examples.sh             # vulnerable vs secure examples

# one rule
semgrep --test --config rules/cors-misconfiguration.yml tests/cors-misconfiguration.ts

# scan an application (read-only; never modifies the target)
semgrep scan --metrics=off --config rules/ /path/to/app
```

Expected output: `All 16 rule files passed.` and 32 `PASS` lines.

---

## 6. Rules for working on this repo (important)

### Honesty and logging
- **Never fabricate** test results, dates, findings, commits or completed
  work. Record only what actually happened.
- When a rule changes, update that feature's `testing-notes.md`,
  `limitations.md` and `implementation-log.md` with real results. Update the
  milestone log if a deliverable changes.
- **Do not weaken an `ok` test** to make an inaccurate rule pass.
- **Write the failing test first.** A regression fixture must be shown to
  fail before the fix and pass after it.
- A status of "Tested" or "Released" means fixtures pass. It does **not**
  mean the rule is validated on real applications.

### Authorship and attribution
- Commits are authored as **Hemanth G
  `<82792350+Hemanth2709@users.noreply.github.com>`**.
- Do **not** add AI attribution anywhere: no `Co-Authored-By` trailers, no
  "Generated with …" lines in commits, PR descriptions or comments. Some tools
  append such footers automatically, so check and remove them.

### Privacy
- Some benchmark runs scanned **private employer or client projects**. In
  public files, describe them only by type (for example "private NestJS
  identity provider with a Next.js SDK"). Never publish their names, file
  paths, function names, commit SHAs or code (see DEC-008). Never name
  client projects at all.
- Only scan code the owner owns or has permission to scan.

### Rule conventions
- Rule IDs start with `sentinel-`.
- Required metadata: `category`, `subcategory` (`vuln` or `audit`),
  `confidence`, `likelihood`, `impact`, `technology`, `cwe`, `owasp`,
  `references`, `documentation`.
- Confirm that each CWE and OWASP mapping really fits the weakness
  (`docs/security-mappings.md`).
- Each rule ID needs at least 2 `ruleid` and 2 `ok` fixtures covering
  different variations.

### Workflow
- Work on a branch and open a PR to `main`. CI must be green.
- Pin dependencies: Semgrep `1.180.0`, `actions/checkout@v5`,
  `actions/setup-python@v6`.
- Use semantic versioning for releases: a rule fix means `v0.1.x`, a new rule
  means `v0.x.0`, docs-only changes need no tag. Create releases from the
  GitHub UI (Releases → Draft new release).

---

## 7. Semgrep gotchas learned in this project

| Gotcha | What to do |
|---|---|
| `semgrep --test rules/` finds no fixtures in this layout and **exits 0** (false green) | Use `scripts/run-tests.sh` (or `--config rules/ tests/`) |
| On Windows, `--test` over a whole directory raises `PermissionError` on `~/.semgrep/settings.yml` and silently skips rule files | `scripts/run-tests.sh` runs one rule file per process with a private `SEMGREP_SETTINGS_FILE` |
| `$1` or `$word` in a rule `message` is treated as a metavariable and **duplicates findings** | Only use bound metavariables in messages; check for duplicates by scanning fixtures directly |
| `--test` compares **lines only**, not counts | Also run `semgrep scan` on the fixture to see duplicates |
| `semgrep scan` ignores `tests/` directories by default | Pass fixture files explicitly when scanning them |
| Object-literal matches are reported at the opening `{` | Put the `ruleid:` comment above the line with `{`, or use `focus-metavariable` |
| `pattern-not: function $F(...)` does **not** negate `export function $F(...)` | Write negations in the same syntactic form as the positive pattern |
| `export function $F` also matches `export async function` | Use `export async function` where async is required (Server Actions) |
| A metavariable bound only in a `pattern-not` cannot be used in `metavariable-regex` | List the alternatives explicitly |
| A bare `pattern-not` cannot be a branch of `pattern-either` | Wrap it in `patterns:` with a positive `pattern` first |
| `metavariable-regex` is anchored at the **start** of the value, and string values keep their quotes (`'html'`) | Write `(?i).*html`, not `(?i)html`, when matching inside a string |
| A `metavariable-regex` placed after a `pattern-either` fails for branches that do not bind its metavariable | Put the regex inside the branch that binds it |
| A rule with no findings at all makes `--test` say "`ruleid` annotation with no YAML rule", not "missed lines" | Expected when showing a stub rule fails first |
| Annotations inside JSX `{/* ruleid: */}` comments are not read | Use `//` comments outside JSX |
| Git Bash on Windows often has `python` but not `python3` | Scripts detect either |

---

## 8. Known limitations (summary)

- **Single-file and mostly syntactic analysis.** There is no cross-file
  dataflow, so global guards (`APP_GUARD`), shared option objects and
  middleware are invisible.
- **The authorization rules are heuristics.** They produce review candidates,
  not proof.
- **Documented gaps** (see each `docs/features/*/limitations.md`):
  - arrow-function route handlers
  - Pages Router `/api` routes
  - GraphQL resolvers
  - `cookies().set({...})` object form
  - the `jose` and `fast-jwt` libraries
  - `.env` files
  - IDOR and other authorization logic
  - global guards and pipes registered in another file
- **Closed in v0.3.0:**
  - weak CORS checks (`endsWith` and similar)
  - Fetch API CORS headers
  - `jwt.decode()` without verify
  - `Prisma.raw()` and other ORM raw fragments (taint)
  - SQL from same-file helpers
  - destructured `process.env` and provider API keys
  - cookie options from a constant
  - DOM sinks (taint)

---

## 9. Benchmark history (public-safe summary)

| Run | Application | Findings | TP | FP | Notes |
|---|---|---|---|---|---|
| 1 | Private NestJS identity provider + Next.js SDK | 8 | 0 | 8 | 7 FPs caused by non-async factory functions in a `'use server'` file. Fixed: the Server Action branch now requires `export async function`. |
| 1b | Same, after the fix | 1 | 0 | 1 | Remaining FP: a route protected by a global `APP_GUARD` in another file (known limitation) |
| 2 | [Event-Booking-NEST-JS](https://github.com/Hemanth2709/Event-Booking-NEST-JS) `5c521fd` | 1 | 0 | 1 | Default public `GET /` hello route; controllers mostly empty |
| 3 | [HemanthG](https://github.com/Hemanth2709/HemanthG) `c0d7ad5` | 1 | 0 | 1 | JSON-LD from static data. Rule now accepts the escaped form; the portfolio was fixed and now scans clean |
| GT | Ground-truth vulnerable app (26 V / 20 S), v0.1.0 | 19 | 14 | 5 | Precision 74%, recall 61%. Unpredicted miss V-02 (`sql +=` inside `if`) |
| GT | Same, v0.1.1 | 20 | 15 | 5 | Precision 75%, recall 65%. V-02 fixed; all FPs are public-by-design routes |
| GT | Extended app (30 V / 24 S), rules 09–12 (`add589d`) | 27 | 20 | 7 | Precision 74%, recall 67% of all 30. Matched every prediction; 2 new FPs predicted (S-22 inline check, Record-typed DB helper) |
| GT | Extended app (35 V / 26 S), rules 13–14 (`76cb377`) | 31 | 24 | 7 | Precision 77%, recall 69% of all 35. Matched every prediction; no new FPs |
| GT | Extended app (37 V / 30 S), v0.3.0 gap fixes and taint rules (`7fe1eef`) | 41 | 33 | 8 | Precision 80%, recall 89% of all 37 (75% and 65% before these changes on the same app). Matched every prediction; no new FPs from the new rules |

---

## 10. Roadmap / next steps

Priority order:

1. ~~Merge PR #8~~ (done).
2. **Ground-truth benchmark.**
   - ~~Build a deliberately vulnerable demo app~~ (done:
     `Hemanth2709/special-umbrella`; see section 9).
   - Scan 10–20 public open-source NestJS/Next.js repos. Report any real bug
     privately to its maintainers.
   - Add a CI job that re-scans pinned repos and fails on unexpected changes.
3. ~~SARIF upload to GitHub code scanning~~ (done: `action.yml`,
   `.github/workflows/code-scanning.yml`, `scripts/sarif-postprocess.py`).
4. **v0.2.0.**
   - ~~Taint mode for SQL injection and XSS~~ (done for v0.3.0:
     `sentinel-sql-injection-tainted-query`, `sentinel-dom-html-sink-user-input`).
   - ~~New rules: SSRF, open redirect, mass assignment, `eval`/`new Function`~~
     (done: rules 09–12, taint mode).
   - ~~Missing Helmet, wildcard `next.config` image `remotePatterns`~~
     (done: rules 13–14).
   - ~~Close the documented gaps in rules 01–07~~ (done for v0.3.0; see
     section 8 for what remains).
   - ~~Release v0.3.0~~ (done, 2026-11-04).
5. **Distribution:**
   - ~~a reusable GitHub Action~~ (done: `action.yml`,
     `uses: Hemanth2709/SentinelRules@v0.3.0`, listed on the
     [GitHub Marketplace](https://github.com/marketplace/actions/sentinel-rules)
     since 2026-11-04)
   - submitting the strongest rules to the Semgrep Registry
   - optional Semgrep `fix:` suggestions for simple cases (keep them
     suggestions, not an auto-fix engine)
6. **Polish:**
   - CI matrix across Semgrep versions
   - Dependabot or Renovate
   - per-rule performance timing
   - README badges and a demo GIF

---

## 11. Where to read more

- `README.md`: user-facing overview
- `docs/rule-writing-guide.md`: how rules are built, with the gotchas
- `docs/testing-guide.md`: test conventions and the regression procedure
- `docs/decisions/decision-log.md`: why things are the way they are
- `docs/benchmark-results.md`: full benchmark records
- `docs/features/*/`: everything about a single rule

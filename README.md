# Sentinel Rules

**Custom security rules for safer code.**

[![Semgrep rule tests](https://github.com/Hemanth2709/SentinelRules/actions/workflows/semgrep-tests.yml/badge.svg)](https://github.com/Hemanth2709/SentinelRules/actions/workflows/semgrep-tests.yml)

Sentinel Rules is an open-source collection of custom [Semgrep](https://semgrep.dev)
rules that detect common security weaknesses in **NestJS** and **Next.js**
applications written in TypeScript or JavaScript. Every rule comes with
annotated tests, a vulnerable and a secure example, CWE/OWASP mappings,
remediation guidance, and an honest list of what it cannot detect.

It is meant to complement general-purpose SAST tools, not replace them.

## Problem

General-purpose scanners cover many vulnerability classes but rarely know
framework conventions: that `ValidationPipe` without `whitelist` allows mass
assignment, that `NEXT_PUBLIC_` variables are shipped to browsers, or that a
NestJS controller without a guard may be open. Framework-aware rules catch
these early, in code review and CI.

## Objectives

- Eight rule features (ten rule IDs) for NestJS / Next.js.
- At least two positive and two negative test cases per rule.
- CWE and OWASP Top 10 2021 mappings.
- Vulnerable and secure examples with remediation.
- Automated rule tests in GitHub Actions.
- A manually reviewed benchmark on an application scanned with permission.

## Supported frameworks and languages

TypeScript and JavaScript (including TSX/JSX). NestJS, Next.js (App Router),
React, Express-style APIs, Prisma, TypeORM, Knex, node-postgres,
`jsonwebtoken`, `passport-jwt`, `cors`.

## Rule catalogue

| # | Rule | Rule ID(s) | Framework | Security issue | Severity | Status |
|---|---|---|---|---|---|---|
| 01 | [SQL injection](docs/features/01-sql-injection/README.md) | `sentinel-sql-injection-raw-query` | NestJS / Node.js | Unsafe raw SQL construction | ERROR | Tested |
| 02 | [JWT misconfiguration](docs/features/02-jwt-misconfiguration/README.md) | `sentinel-jwt-ignore-expiration` · `sentinel-jwt-verify-missing-algorithms` | NestJS / Node.js | Weak JWT verification configuration | ERROR · WARNING | Tested |
| 03 | [ValidationPipe](docs/features/03-validation-pipe/README.md) | `sentinel-nestjs-validation-pipe-missing-whitelist` | NestJS | Inadequate input-property restrictions | WARNING | Tested |
| 04 | [Public secrets](docs/features/04-next-public-secrets/README.md) | `sentinel-next-public-secret-env` | Next.js | Potential client-side secret exposure | ERROR | Tested |
| 05 | [Unsafe HTML](docs/features/05-unsafe-html/README.md) | `sentinel-react-dangerously-set-inner-html` | Next.js / React | Potential XSS | WARNING | Tested |
| 06 | [Insecure cookies](docs/features/06-insecure-cookies/README.md) | `sentinel-insecure-session-cookie` | NestJS / Next.js | Missing cookie security attributes | WARNING | Tested |
| 07 | [CORS misconfiguration](docs/features/07-cors-misconfiguration/README.md) | `sentinel-cors-credentials-any-origin` | NestJS / Node.js | Overly permissive credentialed CORS | ERROR | Tested |
| 08 | [Missing authorization](docs/features/08-missing-authorization/README.md) | `sentinel-nestjs-route-missing-guard` · `sentinel-nextjs-handler-missing-auth-check` | NestJS / Next.js | Potential missing access control (heuristic) | WARNING | Tested |

"Tested" means all positive and negative fixtures pass with the pinned
Semgrep version. No rule is marked "Released" until the benchmark and public
release are complete.

## Installation

```bash
git clone https://github.com/Hemanth2709/SentinelRules.git
cd SentinelRules
python3 -m venv .venv && source .venv/bin/activate
pip install semgrep==1.180.0
```

See [docs/setup-guide.md](docs/setup-guide.md).

## Usage

```bash
# Scan an application (one you own or are permitted to scan)
semgrep scan --metrics=off --config rules/ /path/to/app

# A single rule file
semgrep scan --metrics=off --config rules/cors-misconfiguration.yml /path/to/app

# SARIF for code-scanning tools
semgrep scan --metrics=off --config rules/ --sarif --output sentinel.sarif /path/to/app
```

## Testing

```bash
semgrep --test --config rules/ tests/   # annotated fixtures
scripts/check-examples.sh               # vulnerable vs secure examples
```

Note: `semgrep --test rules/` on its own finds no fixtures in this layout and
exits 0; use the command above ([DEC-003](docs/decisions/decision-log.md)).
Details: [docs/testing-guide.md](docs/testing-guide.md).

## CI/CD

[`.github/workflows/semgrep-tests.yml`](.github/workflows/semgrep-tests.yml)
runs on every push and pull request: install pinned Semgrep → validate rules
→ run fixtures (failing if none are found) → check examples → write a job
summary. See [docs/ci-cd-guide.md](docs/ci-cd-guide.md), including how to run
the pack in another repository's CI.

## CWE and OWASP mappings

| Rule ID | CWE | OWASP 2021 |
|---|---|---|
| `sentinel-sql-injection-raw-query` | CWE-89 | A03 |
| `sentinel-jwt-ignore-expiration` | CWE-613 | A07 |
| `sentinel-jwt-verify-missing-algorithms` | CWE-347 | A02, A07 |
| `sentinel-nestjs-validation-pipe-missing-whitelist` | CWE-915 | A08, A04 |
| `sentinel-next-public-secret-env` | CWE-200, CWE-522 | A01, A05 |
| `sentinel-react-dangerously-set-inner-html` | CWE-79 | A03 |
| `sentinel-insecure-session-cookie` | CWE-1004, CWE-614, CWE-1275 | A05, A07 |
| `sentinel-cors-credentials-any-origin` | CWE-942, CWE-346 | A05, A01 |
| `sentinel-nestjs-route-missing-guard` | CWE-862 | A01 |
| `sentinel-nextjs-handler-missing-auth-check` | CWE-862, CWE-306 | A01, A07 |

Rationale: [docs/security-mappings.md](docs/security-mappings.md).

## Example finding and remediation

**Before** – [`examples/vulnerable/cors-misconfiguration.ts`](examples/vulnerable/cors-misconfiguration.ts):

```ts
app.enableCors({ origin: true, credentials: true });
```

Output of `semgrep scan --config rules/cors-misconfiguration.yml examples/vulnerable/cors-misconfiguration.ts` (Semgrep 1.180.0):

```
    examples/vulnerable/cors-misconfiguration.ts
   ❯❯❱ rules.sentinel-cors-credentials-any-origin
          ❰❰ Blocking ❱❱
          CORS is configured to allow credentials while accepting any requesting origin (`origin: true`, an
          origin callback that always allows, or a reflected Origin header). Any website a signed-in user
          visits can then make authenticated requests and read the responses. Use an explicit allowlist of
          trusted origins and compare the request origin against it.

           12┆ app.enableCors({ origin: true, credentials: true });
```

**After** – [`examples/secure/cors-misconfiguration.ts`](examples/secure/cors-misconfiguration.ts):

```ts
const ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS ?? 'https://app.example.com')
  .split(',')
  .map((origin) => origin.trim());

app.enableCors({ origin: ALLOWED_ORIGINS, credentials: true });
```

Every feature has the same before/after pair in `examples/` and in its
`remediation.md`.

## Benchmark

Methodology: [docs/benchmark-methodology.md](docs/benchmark-methodology.md).

First run (IdentityProvider, a NestJS identity provider with a Next.js SDK,
2026-10-25): **8 findings, 0 true positives, 8 false positives – precision
0%**, all from the two authorization heuristics. Seven were caused by a rule
bug (non-async factories in a `'use server'` file) that has since been fixed
with a regression test; one is the documented global-guard limitation.
Recall is not reported. Details:
[docs/benchmark-results.md](docs/benchmark-results.md).

## Known limitations

- Rules are syntactic and mostly single-scope; they do not trace untrusted
  data across functions or files.
- Configuration in other files (global guards, shared option objects,
  middleware) is not visible.
- The authorization rules are heuristics and produce review candidates, not
  proof.
- No findings does not mean no vulnerabilities.

Per-rule details are in each feature's `limitations.md`; a summary is in
[docs/false-positives.md](docs/false-positives.md).

## Documentation map

| Area | Location |
|---|---|
| Guides | [setup](docs/setup-guide.md) · [rule writing](docs/rule-writing-guide.md) · [testing](docs/testing-guide.md) · [CI/CD](docs/ci-cd-guide.md) · [architecture](docs/architecture.md) |
| Rules | [docs/features/](docs/features/README.md) |
| Project history | [milestones](docs/milestones/README.md) · [decisions](docs/decisions/decision-log.md) · [changelog](CHANGELOG.md) |
| Concepts | [learning notes](docs/learning-notes/README.md) |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). To report a vulnerability in this
project, see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)

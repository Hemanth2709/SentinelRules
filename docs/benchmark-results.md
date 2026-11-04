# Benchmark results

## Ground-truth benchmark (deliberately vulnerable app)

A purpose-built NestJS + Next.js app in a separate, currently private
repository of the maintainer, with **26 planted vulnerabilities** and **20
safe look-alikes**. Each one is labelled in the code, and a prediction for
each was committed before the first scan. Because every answer is known, it
gives real **precision and recall**. In v0.1.x three planted cases (SSRF, open
redirect, mass assignment) had no rule and were counted only in overall
recall; v0.2.0 adds rules for them (see below).

| Rule pack | Findings | TP | FP | Precision | Recall (covered categories) | Recall (all planted) |
|---|---|---|---|---|---|---|
| v0.1.0 | 19 | 14 | 5 | 74% | 61% (14/23) | 54% (14/26) |
| v0.1.1 | 20 | 15 | 5 | 75% | 65% (15/23) | 58% (15/26) |

- **v0.1.0 to v0.1.1:** the benchmark found one miss nobody had predicted,
  case V-02: `sql += ...` inside an `if`. That was fixed, together with the
  related `else`, loop and `OR`-clause gaps found while investigating it.
- **All 5 false positives** are routes and Server Actions that are public by
  design (login, remember-me, logout, theme), flagged by the authorization
  heuristics. This matches their documented limitation.
- **Remaining misses** are all documented limitations, or categories with no
  rule yet: cross-function SQL, `jwt.decode()`, Fetch-API CORS headers,
  `endsWith` origin checks, cookie options from a constant, destructured or
  ambiguous `NEXT_PUBLIC_` names, IDOR, SSRF, open redirect and mass
  assignment.

### v0.2.0 (2026-11-04)

For v0.2.0 the app was extended to **30 planted vulnerabilities and 24 safe
look-alikes**: the SSRF, open-redirect and mass-assignment cases moved from
`out-of-scope` to their own categories, and 8 cases were added (V-27 to V-30,
S-21 to S-24). Predictions for v0.2.0 were committed before the scan. Both
packs below were scanned on the same app commit.

| Rule pack | Findings | TP | FP | Precision | Recall (all 30 planted) |
|---|---|---|---|---|---|
| v0.1.1 | 20 | 15 | 5 | 75% | 50% (15/30) |
| v0.2.0 (scanned at `add589d`; rules unchanged in the release) | 27 | 20 | 7 | 74% | 67% (20/30) |

- **New detections:** V-24 (SSRF), V-25 (open redirect), V-26 (mass
  assignment through a `Record<string, unknown>` service parameter), and the
  new V-27 (`eval` of a query parameter) and V-29 (NestJS SSO callback
  redirect).
- **New false positives (2, both predicted):** S-22, an inline same-site
  check in a ternary that the open-redirect rule does not recognise as a
  sanitizer; and the in-memory database helper, which writes a
  `Record<string, unknown>` parameter with `Object.assign` (unlabelled code).
- **Expected misses:** V-28 (SSRF across a file) and V-30 (rest-destructuring
  denylist), both documented limitations.
- **No differences from the predictions.**
- **Portfolio (run 3 app) re-scanned with all 14 rules:** 0 findings.

Earlier numbers in the first table were measured on the 26/20 version of the
app and are unchanged.

## Real applications


| Run | Application | Type | Findings | TP | FP | Unresolved |
|---|---|---|---|---|---|---|
| 1 | Private identity provider (employer project) | NestJS + Next.js SDK | 8 | 0 | 8 | 0 |
| 1b | Same, after Server Action fix | NestJS + Next.js SDK | 1 | 0 | 1 | 0 |
| 2 | Event-Booking-NEST-JS (maintainer's own) | NestJS | 1 | 0 | 1 | 0 |
| 3 | HemanthG portfolio (maintainer's own) | Next.js 15 | 1 | 0 | 1 | 0 |

Across the latest run of each real application (1b, 2, 3): **3 findings, 0
true positives, 3 false positives – precision 0%.** Recall is not reported: no
defined file set was manually reviewed for missed weaknesses.

Only two rule IDs produced any findings
(`sentinel-nestjs-route-missing-guard`,
`sentinel-react-dangerously-set-inner-html`). The other eight have no
real-world observations yet; their absence of findings says nothing about the
scanned applications' security.

## Run 1 – Private identity provider (2026-10-25)

This application is a private employer project. Its name, file paths and
identifiers are intentionally not published; findings are described
generically.

| Field | Value |
|---|---|
| Application | Private project – NestJS identity provider with a Next.js SDK |
| Commit scanned | Not published (private project) |
| Scan date | 2026-10-25 |
| Platform | Windows, Git Bash, Python 3.14 |
| Semgrep version | 1.180.0 |
| Sentinel Rules commit | `2763d51` (main before the fix below) |
| Command | `semgrep scan --metrics=off --config rules/ <app>` |
| Scope | 143 TypeScript files scanned, ~100% parsed |

### Findings

| # | Rule ID | Location (generalised) | Class | Reason |
|---|---|---|---|---|
| 1 | `sentinel-nestjs-route-missing-guard` | OAuth/OIDC userinfo route handler | FP | Protected by a global guard (`APP_GUARD`) registered in the root module. Cross-file global guard, a known limitation. |
| 2–8 | `sentinel-nextjs-handler-missing-auth-check` | Seven exported functions in the SDK's `'use server'` module | FP | Non-async factory functions that *return* Server Actions; they are not Server Actions themselves. Five cover flows that are public by design (login, registration, logout, SSO); in the two that touch user data, the returned action checks for an access token and exits early without one. |

| Rule ID | Findings | TP | FP | Unresolved |
|---|---|---|---|---|
| `sentinel-nestjs-route-missing-guard` | 1 | 0 | 1 | 0 |
| `sentinel-nextjs-handler-missing-auth-check` | 7 | 0 | 7 | 0 |
| All other 8 rule IDs | 0 | 0 | 0 | 0 |
| **Total** | **8** | **0** | **8** | **0** |

**Precision: 0 / 8 = 0%.**

Recall is not reported: no defined set of files was manually reviewed for
missed weaknesses, so there is no false-negative count. The absence of
findings from the other eight rule IDs does **not** show that the
application is free of those weaknesses.

Classifications are based on code excerpts the maintainer reviewed (the guard
registration, the flagged controller, and the flagged SDK module).

### Rule changes made as a result

| Finding(s) | Change | Regression test |
|---|---|---|
| 2–8 | `sentinel-nextjs-handler-missing-auth-check` now treats only `export async function` in a `'use server'` module as a Server Action (Next.js only allows async exports there) | `createRemoveProjectAction` `ok` case in `tests/missing-authorization.ts`; reproduced as failing before the change, passing after |
| 1 | None. Global guards in other files cannot be seen by a single-file rule. Projects that use a global guard should mark public routes with `@Public()` or disable this rule | – |

## Run 1b – Private identity provider, re-scan after the fix (2026-10-25)

| Field | Value |
|---|---|
| Sentinel Rules commit | `3f21a43` (main, includes the Server Action fix) |
| Semgrep version | 1.180.0 |
| Scope | 141 TypeScript files scanned, ~100% parsed |

The application changed slightly between runs (143 → 141 TypeScript files),
so the two runs were not on an identical commit.

| # | Rule ID | Location (generalised) | Class | Reason |
|---|---|---|---|---|
| 1 | `sentinel-nestjs-route-missing-guard` | OAuth/OIDC userinfo route handler | FP | Same as run 1 #1: global `APP_GUARD` |

| | Run 1 | Run 1b |
|---|---|---|
| Findings | 8 | 1 |
| TP | 0 | 0 |
| FP | 8 | 1 |
| Precision | 0% | 0% |

## Run 2 – Event-Booking-NEST-JS (2026-11-02)

| Field | Value |
|---|---|
| Application | [Hemanth2709/Event-Booking-NEST-JS](https://github.com/Hemanth2709/Event-Booking-NEST-JS) – NestJS 11, GraphQL, Prisma, `@nestjs/jwt` |
| Commit scanned | `5c521fd` |
| Permission basis | Maintainer's own public repository |
| Platform | Linux, Semgrep 1.180.0 |
| Sentinel Rules commit | `a3c997c` (main) |
| Scope | 33 files scanned, 0 errors |

| # | Rule ID | Location | Class | Reason |
|---|---|---|---|---|
| 1 | `sentinel-nestjs-route-missing-guard` | `src/app.controller.ts` – `getHello` | FP | Default `GET /` "hello" route; public by design and returns no data. |

Limited coverage: the `users`, `events` and `bookings` controllers and
resolvers are empty scaffolds, so the application has almost no route,
query, cookie or JWT code yet for the rules to evaluate.

## Run 3 – HemanthG portfolio (2026-11-02)

| Field | Value |
|---|---|
| Application | [Hemanth2709/HemanthG](https://github.com/Hemanth2709/HemanthG) – Next.js 15, React 19 |
| Commit scanned | `c0d7ad5` |
| Permission basis | Maintainer's own public repository |
| Platform | Linux, Semgrep 1.180.0 |
| Sentinel Rules commit | `a3c997c` (main) |
| Scope | 43 files scanned, 0 errors |

| # | Rule ID | Location | Class | Reason |
|---|---|---|---|---|
| 1 | `sentinel-react-dangerously-set-inner-html` | `src/app/layout.tsx` – JSON-LD `<script>` | FP | `JSON.stringify(jsonLd)` of data built from the static `src/data/site.ts`; no user-controlled input. |

The finding is a false positive for this application, but the code uses the
unescaped form. The Next.js JSON-LD guide recommends
`JSON.stringify(data).replace(/</g, '\\u003c')`, which keeps the output safe
even if the data later comes from a CMS or user input.

### Rule change made as a result

`sentinel-react-dangerously-set-inner-html` now treats
`JSON.stringify(...).replace(/</g, ...)` as safe. Only the global regex form is
accepted; `.replace('<', ...)` replaces the first occurrence only and is still
reported. New fixtures: `JsonLdEscaped` (ok), `JsonLdUnescaped` and
`JsonLdFirstOnlyEscape` (ruleid). The escaped fixture failed before the change
and passes after. The portfolio's JSON-LD was then escaped
([Hemanth2709/HemanthG#4](https://github.com/Hemanth2709/HemanthG/pull/4));
its CI scan now reports 0 findings.

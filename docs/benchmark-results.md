# Benchmark results

## Run 1 – IdentityProvider (2026-10-25)

| Field | Value |
|---|---|
| Application | IdentityProvider (Ralecon) – NestJS identity provider with a Next.js SDK |
| Commit scanned | _not yet recorded_ |
| Permission basis | _to be confirmed by the maintainer_ |
| Scan date | 2026-10-25 |
| Platform | Windows, Git Bash, Python 3.14 |
| Semgrep version | 1.180.0 |
| Sentinel Rules commit | `2763d51` (main before the fix below) |
| Command | `semgrep scan --metrics=off --config rules/ <app>` |
| Scope | 162 git-tracked files, 143 TypeScript files scanned, ~100% parsed |

### Findings

| # | Rule ID | Location | Class | Reason |
|---|---|---|---|---|
| 1 | `sentinel-nestjs-route-missing-guard` | `src/oauth/oauth.controller.ts` – `userinfo` | FP | `app.module.ts` registers an `APP_GUARD`; the controller documents that `JwtAuthGuard` is applied globally. Cross-file global guard, a known limitation. |
| 2 | `sentinel-nextjs-handler-missing-auth-check` | `src/sdk/nextjs/actions.ts` – `createLoginAction` | FP | Non-async factory that returns an action, not a Server Action; login is public by design. |
| 3 | same | `createRegisterAction` | FP | Non-async factory; registration is public by design. |
| 4 | same | `createGetDevicesAction` | FP | Non-async factory; the returned action calls `getAccessToken()` and returns early without a token. |
| 5 | same | `createRemoveDeviceAction` | FP | Non-async factory; the returned action calls `getAccessToken()` and returns an error without a token. |
| 6 | same | `createLogoutAction` | FP | Non-async factory; logout. |
| 7 | same | `createSsoLoginAction` | FP | Non-async factory; SSO login is public by design. |
| 8 | same | `createSsoCallbackHandler` | FP | Non-async factory; SSO callback is public by design. |

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

Classifications are based on excerpts the maintainer provided
(`app.module.ts` guard registration, the top of `oauth.controller.ts`, and
`actions.ts` lines 115–155 plus the location of its `'use server'` directive).
The `APP_GUARD` provider's class was taken from the controller's comment and
was not seen directly.

### Rule changes made as a result

| Finding(s) | Change | Regression test |
|---|---|---|
| 2–8 | `sentinel-nextjs-handler-missing-auth-check` now treats only `export async function` in a `'use server'` module as a Server Action (Next.js only allows async exports there) | `createRemoveProjectAction` `ok` case in `tests/missing-authorization.ts`; reproduced as failing before the change, passing after |
| 1 | None. Global guards in other files cannot be seen by a single-file rule. Projects that use a global guard should mark public routes with `@Public()` or disable this rule | – |

**Expected effect:** a re-scan should report 1 finding (#1) instead of 8. This
has **not yet been confirmed** by re-scanning the application.

### Other observation

`actions.ts` has `'use server'` at module level but exports non-async
functions. Next.js normally rejects non-async exports from a `'use server'`
file. This is a build-compatibility point for the SDK, not a security finding.

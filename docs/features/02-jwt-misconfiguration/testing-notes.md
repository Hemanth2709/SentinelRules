# JWT misconfiguration: testing notes

Fixture: [`tests/jwt-misconfiguration.ts`](../../../tests/jwt-misconfiguration.ts)

## `sentinel-jwt-ignore-expiration`

| Case | Expected |
|---|---|
| `LegacyJwtStrategy` – passport-jwt options with `ignoreExpiration: true` | finding |
| `legacyJwtModule` – `JwtModule.register({ verifyOptions: { ignoreExpiration: true } })` | finding |
| `JwtStrategy` – `ignoreExpiration: false` with `algorithms` | no finding |
| `jwtModule` – `verifyOptions` without `ignoreExpiration` | no finding |

## `sentinel-jwt-verify-missing-algorithms`

| Case | Expected |
|---|---|
| `verifyWithoutOptions` – `jwt.verify(token, key)` | finding |
| `verifyWithOptionsButNoAlgorithms` – options with `audience`, `issuer` only | finding |
| `verifyWithCallbackOnly` – callback, no options | finding |
| `verifyViaRequire` – `require('jsonwebtoken')` binding | finding |
| `verifyWithPinnedAlgorithm` – `{ algorithms: ['RS256'] }` | no finding |
| `verifyWithPinnedAlgorithmAndCallback` | no finding |
| `verifyWithSharedOptionsObject` – options variable | no finding |
| `verifyWithSpreadOptions` – `{ ...options, audience }` | no finding |
| `unrelatedVerifyMethod` – `.verify()` on a non-jsonwebtoken object | no finding |

## Commands

```bash
semgrep --test --config rules/jwt-misconfiguration.yml tests/jwt-misconfiguration.ts
scripts/run-tests.sh
```

## Results

| Date | Semgrep | Result |
|---|---|---|
| 2026-10-25 | 1.180.0 | `2/2: ✓ All tests passed` (6 findings, 7 non-findings) |

## Failures and resolutions

| Date | Problem | Resolution |
|---|---|---|
| 2026-10-25 | `ignoreExpiration` finding was reported on the first line of the multi-line `super({...})` object (line 20) instead of the property line (23). | Added `metavariable-pattern` + `focus-metavariable` so the finding is placed on the value. |
| 2026-10-25 | Ad-hoc scan showed `jwt.verify(t, k, { ...base, audience })` reported even though `base` contained `algorithms`. | Added a `pattern-not` for options containing a spread, plus the `verifyWithSpreadOptions` negative fixture. |

# Insecure cookies: testing notes

Fixture: [`tests/insecure-cookies.ts`](../../../tests/insecure-cookies.ts)

## Expected findings

| Case | Problem |
|---|---|
| `AuthController.login` | `res.cookie('session_id', v)` with no options |
| `AuthController.refresh` | `httpOnly` only; `secure` and `sameSite` missing |
| `AuthController.legacy` | all present but `secure: false` |
| `loginAction` | `(await cookies()).set('session', ...)` without `httpOnly` |
| `GET` | `response.cookies.set('access_token', ...)` with `httpOnly: false` |

## Expected non-findings

| Case | Reason |
|---|---|
| `SecureAuthController.login` | all three attributes, `secure` conditional |
| `secureLoginAction` | all three attributes, different order |
| `setPreferences` | `theme` is not a session cookie |
| `cacheSet` | `Map.set('token', ...)` is not a cookie API |

## Commands

```bash
semgrep --test --config rules/insecure-cookies.yml tests/insecure-cookies.ts
scripts/run-tests.sh
```

## Results

| Date | Semgrep | Result |
|---|---|---|
| 2026-10-25 | 1.180.0 | `✓ All tests passed` (5 findings, 4 non-findings) |

## Failures and resolutions

| Date | Problem | Resolution |
|---|---|---|
| 2026-10-25 | The first draft used two rule IDs (missing attributes, `secure: false`). Merging them into one `pattern-either` with a bare `pattern-not` failed validation: "you cannot negate in an Or". | Wrapped the negation in a nested `patterns` block with a positive `pattern` first. |
| 2026-10-25 | Rule message wrapped the cookie name in extra quotes (`''session_id''`) because `$NAME` already includes its quotes. | Removed the quotes around `$NAME` in the message. |

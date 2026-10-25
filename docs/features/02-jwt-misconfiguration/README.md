# Rule 02: JWT verification misconfiguration

| | |
|---|---|
| Rule IDs | `sentinel-jwt-ignore-expiration`, `sentinel-jwt-verify-missing-algorithms` |
| Rule file | [`rules/jwt-misconfiguration.yml`](../../../rules/jwt-misconfiguration.yml) |
| Test fixture | [`tests/jwt-misconfiguration.ts`](../../../tests/jwt-misconfiguration.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/jwt-misconfiguration.ts) · [secure](../../../examples/secure/jwt-misconfiguration.ts) |
| Severity | ERROR (ignore-expiration) · WARNING (missing algorithms) |
| Confidence | HIGH · LOW |
| CWE | CWE-613 · CWE-347 |
| OWASP | A07:2021 · A02:2021, A07:2021 |
| Status | Tested |

## Purpose

The file contains two rules because the two checks have different
confidence:

1. **`sentinel-jwt-ignore-expiration`** – any object literal that sets
   `ignoreExpiration: true`. The option exists only in JWT libraries
   (`jsonwebtoken`, `passport-jwt`, `@nestjs/jwt` `verifyOptions`), and the
   intent is unambiguous: expired tokens are accepted.
2. **`sentinel-jwt-verify-missing-algorithms`** – `jsonwebtoken.verify()`
   called without an `algorithms` allowlist. This is a suspicious
   configuration rather than a proven vulnerability, so it is reported at
   WARNING with LOW confidence.

## Running the tests

```bash
semgrep --test --config rules/jwt-misconfiguration.yml tests/jwt-misconfiguration.ts
```

## Interpreting a finding

- *ignore-expiration*: almost always a real problem. Valid exceptions are
  rare (for example, decoding an expired token deliberately to read its
  claims during refresh – and even then the signature must still be checked
  and the refresh token validated separately).
- *missing algorithms*: check the key type and library version. If the key
  can only be used with one algorithm family and you use `jsonwebtoken` v9+,
  the practical risk is low, but pinning the algorithm is still recommended.

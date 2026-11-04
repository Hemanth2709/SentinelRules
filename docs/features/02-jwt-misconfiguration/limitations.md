# JWT misconfiguration: limitations

## Known false positives

- `ignoreExpiration: true` used deliberately to read claims from an expired
  token during a refresh flow where the signature is still verified and a
  separate refresh token is validated. Suppress with `// nosemgrep` and a
  justification.
- `jwt.verify()` without `algorithms` where the key type and library version
  already restrict verification to one algorithm family (e.g. `jsonwebtoken`
  v9 with an RSA public key rejects `HS256`). The rule cannot see the key
  type or the installed version.

## Known false negatives

- `ignoreExpiration` set from a variable (`ignoreExpiration: isDev`).
- `@nestjs/jwt` `JwtService.verify()` / `verifyAsync()` without algorithms.
- `passport-jwt` strategies without `algorithms`.
- Options passed via a variable or a spread (excluded by design).
- `jwt.decode()` used in place of `jwt.verify()`: covered since v0.3.0 by
  `sentinel-jwt-decode-without-verify` when the decode and the missing
  verify are in the same function (see below).
- Other JWT libraries (`jose`, `fast-jwt`) are not covered.

## Library-specific notes

- `jsonwebtoken` v9 changed several defaults (e.g. rejecting the `none`
  algorithm unless explicitly allowed, and rejecting some key/algorithm
  mismatches). The algorithms rule remains useful as defence in depth and for
  projects on older versions.

## What the rule cannot establish

Whether a wrapper, module-level configuration, or library default already
enforces an algorithm allowlist or expiration.

## `sentinel-jwt-decode-without-verify` (v0.3.0)

- Any `.verify(...)` or `.verifyAsync(...)` call in the same function
  suppresses the finding, even on a different token or object.
- A function that decodes a token which an earlier middleware or guard
  already verified is still reported; mark it as reviewed or decode the
  verified payload instead.
- Only the `jsonwebtoken` module is covered (`decodeJwt` from `jose` and
  `jwt-decode` in browsers are not).

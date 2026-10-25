# JWT misconfiguration: detection logic

Rule file: [`rules/jwt-misconfiguration.yml`](../../../rules/jwt-misconfiguration.yml)

## `sentinel-jwt-ignore-expiration`

```yaml
- pattern: "{..., ignoreExpiration: $VALUE, ...}"
- metavariable-pattern: { metavariable: $VALUE, pattern: "true" }
- focus-metavariable: $VALUE
```

- Matches any object literal with `ignoreExpiration: true`, which covers
  `passport-jwt` strategy options, `@nestjs/jwt` `verifyOptions`, and
  `jsonwebtoken.verify()` options.
- `focus-metavariable` places the finding on the `true` value so the report
  points at the offending property instead of the start of a multi-line
  object.
- `ignoreExpiration: false` and omitted options are not reported.

## `sentinel-jwt-verify-missing-algorithms`

1. **Module scope** – `pattern-inside` restricts `$J` to a binding created by
   `import $J from 'jsonwebtoken'`, `import * as $J from 'jsonwebtoken'`, or
   `$J = require('jsonwebtoken')`. Without this, every `.verify()` method
   (crypto signers, NestJS `JwtService`) would match.
2. **Reported forms**
   - `$J.verify(token, key)` – no options.
   - `$J.verify(token, key, callback)` – arrow or function callback, no options.
   - `$J.verify(token, key, {...})` where the inline object has no
     `algorithms` key.
3. **Excluded forms**
   - Options object containing `algorithms: ...`.
   - Options object containing a spread (`{ ...shared }`) – the spread may
     supply `algorithms`, so it cannot be judged.
   - Options passed as a variable – not inspectable.

## Why the detector may miss cases

- `JwtService.verify()` / `verifyAsync()` in `@nestjs/jwt` is not covered by
  the algorithms rule: its algorithm list is normally configured at module
  level (`JwtModule.register({ verifyOptions })`), which may be in another
  file.
- `passport-jwt` strategies without `algorithms` are not reported.
- `jwt.decode()` used *instead of* `verify()` is not detected.
- Options assembled in variables or other files are not inspected.

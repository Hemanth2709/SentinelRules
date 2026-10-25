# CORS: detection logic

Rule: [`rules/cors-misconfiguration.yml`](../../../rules/cors-misconfiguration.yml)

## Matching

| Case | Pattern |
|---|---|
| Reflect all | `{..., origin: true, ..., credentials: true, ...}` |
| Allow-all callback | `origin: ($O, $CB) => $CB(null, true)` (arrow expression, arrow block, `function`) with `credentials: true` |
| Echo callback | `origin: ($O, $CB) => $CB(null, $O)` with `credentials: true` |
| Manual headers | `$RES.$SET("Access-Control-Allow-Origin", $REQ.headers.origin)` followed or preceded by `$RES.$SET("Access-Control-Allow-Credentials", "true")`, with `$SET` one of `setHeader`, `header`, `set` |

Object patterns are order-independent, so `credentials` may appear before or
after `origin`.

## Why these patterns

The object literal shape is the same for `app.enableCors`, `cors()`, and the
`cors` option of `NestFactory.create`, so one pattern covers all three without
matching the call.

## Safe patterns that should not match

- `origin: ['https://app.example.com']` (allowlist) with credentials.
- Callback that checks an allowlist: `cb(null, allowed.includes(origin))`.
- `origin: true` with `credentials: false`.
- Manual headers that set a validated origin variable.

## Why the detector may miss cases

- Weak origin checks: `origin.endsWith('example.com')` (matches
  `evil-example.com`), unanchored regexes, `includes()` on strings.
- Options built in variables or in configuration files.
- Next.js `headers()` in `next.config.js` or middleware that sets CORS
  headers.
- Header names written in different case.

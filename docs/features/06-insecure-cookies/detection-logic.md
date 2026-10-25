# Insecure cookies: detection logic

Rule: [`rules/insecure-cookies.yml`](../../../rules/insecure-cookies.yml)

## Matching

1. **Sink** – one of `$RES.cookie(...)`, `cookies().set(...)`,
   `(await cookies()).set(...)`, `$RESPONSE.cookies.set(...)`, with either no
   options or an inline options object.
2. **Insecure configuration** – either:
   - the call does **not** match
     `{..., httpOnly: true, ..., secure: $SECURE, ..., sameSite: $SAMESITE, ...}`
     (Semgrep object patterns are order-independent), or
   - the call sets `secure: false`.
3. **Session-like name** – `metavariable-regex` on `$NAME` requires a quoted
   literal containing a session/credential word.

## Why these patterns

- Restricting `.set()` to `cookies()` and `.cookies` receivers avoids
  matching `Map.prototype.set('token', ...)`.
- Requiring a literal name keeps preference and analytics cookies out of
  scope.
- Accepting any value for `secure` (except `false`) allows the common
  `secure: process.env.NODE_ENV === 'production'` pattern.

## Safe patterns that should not match

- All three attributes set, in any order.
- Non-session cookie names (`theme`).
- `Map.set`, `URLSearchParams.set` and similar.

## Why the detector may miss cases

- Options passed in a variable (`res.cookie('sid', v, cookieOptions)`).
- Cookie names held in constants (`res.cookie(SESSION_COOKIE, v)`).
- Next.js object form: `cookies().set({ name: 'session', value, ... })`.
- `express-session` / `cookie-session` configuration
  (`session({ cookie: {...} })`).
- `res.setHeader('Set-Cookie', ...)` written by hand.

These three were confirmed in an ad-hoc scan on 2026-10-25.

# Open redirect: detection logic

Rule: [`rules/open-redirect.yml`](../../../rules/open-redirect.yml)

Taint mode (DEC-010): a value from the request must reach a redirect
destination.

**Sources**

- Next.js / Web API: `new URL(req.url).searchParams.get(...)`, `req.nextUrl.searchParams.get(...)`, `await req.json()`, `(await req.formData()).get(...)`
- Server Actions: `formData.get(...)` on a `FormData` parameter
- Express: `req.query`, `req.body`, `req.params`
- NestJS: parameters decorated with `@Query()`, `@Param()`, `@Body()` or `@Headers()`

**Sinks:** the first argument of `NextResponse.redirect`, `Response.redirect`,
`redirect`, `permanentRedirect` and `res.redirect(url)` /
`res.redirect(status, url)`, and the `url` of an object returned from a method
decorated with `@Redirect()`.

**Sanitizers**

- A check named like `isSafeRedirect`, `validateRedirect`, `isRelativePath`
  cleans its argument from that point on (`by-side-effect`).
- A helper named like `safeRedirectPath(...)` or `sanitizeRedirect(...)`
  returns a clean value.
- A lookup in a constant UPPER_CASE map, and `encodeURIComponent(...)`.

A template literal with a fixed same-site prefix (`` `/account/orders/${id}` ``)
is not a sink.

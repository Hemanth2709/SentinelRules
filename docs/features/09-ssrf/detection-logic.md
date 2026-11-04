# SSRF: detection logic

Rule: [`rules/ssrf.yml`](../../../rules/ssrf.yml)

Taint mode (DEC-010): a value from the request must reach the URL argument
of an HTTP client call.

**Sources**

- Next.js / Web API: `new URL(req.url).searchParams.get(...)`, `req.nextUrl.searchParams.get(...)`, `await req.json()`, `(await req.formData()).get(...)`
- Server Actions: `formData.get(...)` on a `FormData` parameter
- Express: `req.query`, `req.body`, `req.params`
- NestJS: parameters decorated with `@Query()`, `@Param()`, `@Body()` or `@Headers()`

**Sinks:** the first argument of `fetch`, `axios(...)`, `got(...)`, and
`get/post/put/patch/delete/head/options/request` on `axios`, `got`, `http`,
`https`, `this.httpService`, `this.httpClient` and `this.<client>.axiosRef`.

**Sanitizers**

- A call named like an allowlist check (`isAllowedUrl`, `assertAllowedUrl`,
  `validateUrl`, `isSafeTarget`, ...) cleans its argument from that point on
  (`by-side-effect`), so `if (!isAllowedUrl(url)) return ...; fetch(url)` is
  not flagged.
- A lookup in a constant map with an UPPER_CASE name (`UPSTREAMS[region]`).
- `encodeURIComponent(...)`, which keeps a value inside a path or query
  component.

A template literal that starts with a fixed `https://host/` is not a sink: the
user controls only the path.

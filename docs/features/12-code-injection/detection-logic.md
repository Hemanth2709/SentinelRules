# Code injection: detection logic

Rule: [`rules/code-injection.yml`](../../../rules/code-injection.yml)

Taint mode (DEC-010).

**Sources:** the same request sources as Rules 09 and 10:

- Next.js / Web API: `new URL(req.url).searchParams.get(...)`, `req.nextUrl.searchParams.get(...)`, `await req.json()`, `(await req.formData()).get(...)`
- Server Actions: `formData.get(...)` on a `FormData` parameter
- Express: `req.query`, `req.body`, `req.params`
- NestJS: parameters decorated with `@Query()`, `@Param()`, `@Body()` or `@Headers()`

**Sinks:** the code argument of `eval`, `new Function(...)` / `Function(...)`
(the last argument is the body), `setTimeout` / `setInterval`, and the `vm`
functions listed above. Functions passed to `setTimeout` are excluded, as only
strings are compiled.

**Sanitizers:** a lookup in a constant UPPER_CASE map
(`OPERATIONS[op]`). There is deliberately no name-based sanitizer: escaping
does not make evaluated code safe.

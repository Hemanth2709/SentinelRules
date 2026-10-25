# Missing authorization: detection logic

Rule file: [`rules/missing-authorization.yml`](../../../rules/missing-authorization.yml)

## `sentinel-nestjs-route-missing-guard`

1. `pattern-inside: @Controller(...) class $CONTROLLER { ... }`
2. `pattern-not-inside` the same class decorated with `@UseGuards(...)` or
   `@Public()`.
3. `pattern: @$ROUTE(...) $HANDLER(...) { ... }` with `$ROUTE` matching
   `Get|Post|Put|Patch|Delete|All|Options|Head`.
4. `pattern-not` for methods decorated with `@UseGuards(...)`, `@Public()`,
   `@SkipAuth()`, or `@AllowAnonymous()`. Semgrep matches a decorator in the
   pattern against a declaration that has additional decorators, in any
   order.
5. `focus-metavariable: $HANDLER` – the finding points at the method name.

## `sentinel-nextjs-handler-missing-auth-check`

1. Either:
   - `export function $HANDLER(...) { ... }` with `$HANDLER` in
     `POST|PUT|PATCH|DELETE` (App Router route handler), or
   - an exported **async** function after a `'use server'` / `"use server"`
     directive (Server Action). Next.js only allows async exports in such a
     module, so non-async exports (e.g. factories that return actions) are
     skipped.

   The pattern `export function` also matches `export async function`
   (verified during development).
2. `pattern-not` for each recognised helper:
   `export function $HANDLER(...) { ... getServerSession(...); ... }` etc.
   Semgrep matches the call even when it is nested in a statement such as
   `const session = await getServerSession(authOptions)`.
3. `focus-metavariable: $HANDLER`.

GET handlers are excluded because public read endpoints are common; this
reduces noise at the cost of missing read-side IDORs.

## Why the detector may miss cases

See [limitations.md](limitations.md). In short: anything outside the matched
function (global guards, middleware, wrappers) is invisible, and the rule
cannot tell whether a check is *correct*.

## Development notes

- A negation written as `function $M(...) { ... }` did **not** exclude
  `export async function` matches; negations must repeat the `export`
  form.
- Metavariables that appear only in negative patterns cannot be filtered
  with `metavariable-regex`, so public-marker decorators are listed
  explicitly.

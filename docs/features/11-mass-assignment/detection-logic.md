# Mass assignment: detection logic

Rule: [`rules/mass-assignment.yml`](../../../rules/mass-assignment.yml)

Taint mode (DEC-010), with sinks that only match the whole object.

**Sources**

- `await req.json()`, Express `req.body`
- NestJS `@Body()` typed `any`, `object` or `Record<...>`. A DTO class is not
  a source: with `ValidationPipe({ whitelist: true })` unknown keys are
  stripped, which Rule 03 checks.
- Any function parameter typed `Record<...>` (service methods that receive a
  request body).

**Sinks** (the written value only)

1. The value is a plain identifier or member expression (`data: body`,
   `save(dto)`), never an object literal.
2. The value is an object literal that spreads a tainted object
   (`{ ...input, ownerId }`); the spread itself is reported.

Picked fields (`data: { name: body.name }`) are never a sink.

**Sanitizers:** `$SCHEMA.parse(...)`, `parseAsync`, `validateSync`,
`safeParse(...).data`, and `pick(...)` / `_.pick(...)`.

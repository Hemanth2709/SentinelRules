# SQL injection: detection logic

Rule: [`rules/sql-injection.yml`](../../../rules/sql-injection.yml)

## Overview

The rule reports a call when all of these hold:

1. **Sink** – the method is one of `$queryRawUnsafe`, `$executeRawUnsafe`,
   `query`, `raw`, or `execute` (checked with `metavariable-regex` on
   `$METHOD`).
2. **SQL argument** – the first argument (`$SQLSTR`) is either written in the
   call, or is a variable assigned (`=`) or appended to (`+=`) earlier in the
   same scope.
3. **Dynamic text** – `$SQLSTR` is a template literal containing at least one
   `${...}`, a `+` concatenation, or a `.concat(...)` call
   (`metavariable-pattern`).
4. **Looks like SQL** – the source text of `$SQLSTR` matches an SQL keyword
   regex such as `select ... from`, `insert into`, `update ... set`,
   `delete from`, `where`, `order by`, `group by`, `values (`
   (`metavariable-regex`).

## Why these patterns

- Method names alone are too broad: `query` and `execute` exist on GraphQL
  clients, HTTP helpers and many other objects. The SQL keyword check keeps
  those out without needing type information.
- Only the **first argument** is inspected. Parameterised calls such as
  `pool.query('... $1', [value])` or `knex.raw('... ?', [value])` pass values
  in later arguments, so they are not reported.
- Tagged templates (`prisma.$queryRaw\`...\``) are a different syntax node
  from a call with a template-literal argument, so they never match the sink
  pattern.
- A template literal with no `${}` is constant and is excluded by the
  dynamic-text check.

## Safe patterns that should not match

| Pattern | Why it is safe |
|---|---|
| ``prisma.$queryRaw`... ${x}` `` | Tagged template, values are bound parameters |
| `prisma.$queryRawUnsafe('... $1', x)` | SQL text is constant |
| `pool.query('... $1', [x])` | Values passed separately |
| `knex.raw('... ?', [x])` | Values passed separately |
| `knex('t').where({ id })` | Query builder |
| ``client.query(`{ user(id: "${id}") }`)`` | Not SQL text |

## Why the detector may miss cases

- Values built in another function or file and passed in are not traced
  (no cross-function dataflow).
- SQL assembled with array `join()`, helper functions, or `Prisma.raw()` is
  not recognised.
- Queries whose text does not contain any of the recognised keywords (for
  example a bare table name) are skipped by design.
- Sinks under other method names. `sequelize.query(...)` matches because the
  method is named `query` (confirmed in an ad-hoc scan on 2026-10-25, no
  fixture yet); a custom `runSql()` wrapper does not.

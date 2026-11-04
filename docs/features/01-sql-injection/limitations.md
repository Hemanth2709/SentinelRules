# SQL injection: limitations

## Known false positives

- **Values that are dynamic but trusted** – e.g. a table name taken from an
  internal enum, or a number already parsed and range-checked. The rule sees
  dynamic text and reports it. Prefer rewriting with an allowlist so the
  intent is visible; otherwise suppress with `// nosemgrep` and a comment.
- **Constant concatenation** – `'SELECT a ' + 'FROM t WHERE x = 1'` (two
  literals) is reported, although it is constant (confirmed in an ad-hoc scan
  on 2026-10-25).
- **Non-SQL `query` / `execute` / `raw` methods** whose text happens to
  contain words such as `where` followed by whitespace.

## Known false negatives

- SQL built in another module or a class property and passed in, when the
  values are not request data in the same file (for example a service
  method parameter). Since v0.3.0, a helper function in the **same file** is
  followed (benchmark V-03, detected), and the taint rule reports request
  data that reaches the query through a helper in any module (V-36).
- `+=` appends inside `switch`, `try`/`catch` or `do`/`while` blocks (not
  covered by a pattern and not tested).
- SQL built with `Array.prototype.join`, `util.format`, or a helper, unless
  the values are request data (then the v0.3.0 taint rule reports it).
- Prisma `Prisma.raw()`, Sequelize `literal()`, knex `*Raw` and TypeORM
  query-builder fragments are not checked by this structural rule. Since
  v0.3.0 the taint rule reports them when request data reaches them; with
  other values they are not reported.
- SQL without any of the recognised keywords.
- Wrapper methods with other names.

## Patterns requiring manual review

Any finding where the interpolated value's source is not visible in the same
function.

## What the rule cannot establish

Whether the interpolated value is attacker-controlled. Semgrep matches syntax
in a single scope; it does not perform cross-file taint tracking here.

## Taint rule (`sentinel-sql-injection-tainted-query`, v0.3.0)

- Sources are request data only: query string, body, route params, form
  data, and decorated NestJS handler parameters. Data that reaches a service
  through a method parameter in **another file** is not tracked: Semgrep's
  open-source taint mode works within one file.
- Unknown functions are assumed to pass taint through, which is how helpers
  in other modules are covered; a helper that actually validates its input
  is not recognised unless it is `Number`, `parseInt`, `parseFloat`,
  `BigInt`, an `escape*` function or a lookup in an UPPER_CASE constant map.
- TypeORM `.where()`, `.orderBy()` and similar are sinks for their first
  argument only, and other libraries' `.where()` methods with the same
  names (for example Mongoose) can be reported.
- SQL interpolated directly in a raw query call is left to
  `sentinel-sql-injection-raw-query`, so the two rules do not report the
  same line.

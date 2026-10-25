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

- SQL built in another function, module, or class property and passed in.
- SQL built with `Array.prototype.join`, `util.format`, or a helper.
- Prisma `Prisma.raw()` misuse such as
  ``$queryRaw`... ${Prisma.raw(userInput)}` `` (confirmed not reported in an
  ad-hoc scan on 2026-10-25).
- Raw SQL in Sequelize `literal()`, TypeORM `createQueryBuilder().where(\`...${x}\`)`
  and other query-builder escape hatches.
- SQL without any of the recognised keywords.
- Wrapper methods with other names.

## Patterns requiring manual review

Any finding where the interpolated value's source is not visible in the same
function.

## What the rule cannot establish

Whether the interpolated value is attacker-controlled. Semgrep matches syntax
in a single scope; it does not perform cross-file taint tracking here.

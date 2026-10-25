# Rule 01: SQL injection in raw queries

| | |
|---|---|
| Rule ID | `sentinel-sql-injection-raw-query` |
| Rule file | [`rules/sql-injection.yml`](../../../rules/sql-injection.yml) |
| Test fixture | [`tests/sql-injection.ts`](../../../tests/sql-injection.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/sql-injection.ts) · [secure](../../../examples/secure/sql-injection.ts) |
| Severity | ERROR |
| Confidence | MEDIUM |
| CWE | CWE-89 |
| OWASP | A03:2021 Injection |
| Status | Tested |

## Purpose

Flags calls to raw-SQL APIs where the SQL text itself is assembled from
dynamic values, so that a user-controlled value could change the structure of
the query.

## APIs covered

| API | Example |
|---|---|
| Prisma `$queryRawUnsafe`, `$executeRawUnsafe` | `prisma.$queryRawUnsafe(\`... ${x}\`)` |
| TypeORM `DataSource.query` / `EntityManager.query` | `dataSource.query("..." + x)` |
| node-postgres / mysql2 `.query` / `.execute` | `pool.query(\`... ${x}\`)` |
| Knex `.raw` | `knex.raw(\`... ${x}\`)` |

## Files

- `vulnerability-explanation.md` – what the weakness is and why it matters.
- `detection-logic.md` – how the rule works.
- `remediation.md` – how to fix a finding.
- `testing-notes.md` – fixtures and recorded test results.
- `limitations.md` – false positives and false negatives.
- `implementation-log.md` – development history.

## Running the tests

```bash
semgrep --test --config rules/sql-injection.yml tests/sql-injection.ts
```

## Interpreting a finding

A finding means the SQL *text* is dynamic. It does not prove that the dynamic
part is attacker-controlled. Trace each interpolated value back to its source:
if any part comes from a request, a database field written by users, or
another untrusted source, treat it as a vulnerability.

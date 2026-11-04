# SQL injection: testing notes

Fixture: [`tests/sql-injection.ts`](../../../tests/sql-injection.ts)

## Expected findings (`ruleid`)

| Function | Case |
|---|---|
| `prismaUnsafeTemplate` | `$queryRawUnsafe` with interpolated template literal |
| `prismaUnsafeExecuteConcat` | `$executeRawUnsafe` with `+` concatenation |
| `prismaUnsafeBuiltInVariable` | SQL built in a variable, then passed |
| `pgQueryConcatenation` | node-postgres `pool.query` with concatenation |
| `typeormQueryTemplate` | TypeORM `dataSource.query` with template literal |
| `knexRawTemplate` | `knex.raw` with template literal |
| `appendedFilter` | Constant base query extended with `+=` |
| `conditionalFilter` | `+=` inside a one-line `if` (benchmark V-02) |
| `conditionalFilterBraced` | `+=` inside a braced `if` |
| `conditionalFilterElse` | `+=` inside an `else` branch |
| `loopFilter` | `+=` inside a braced `for...of` |
| `loopFilterNoBraces` | `+=` inside a `for...of` without braces |
| `whileFilter` | `+=` inside a `while` loop |
| `orFilter` | Appended clause starting with `OR email =` |

## Expected non-findings (`ok`)

| Function | Case |
|---|---|
| `prismaTaggedTemplate` | Tagged `$queryRaw` (parameterised) |
| `prismaUnsafeWithPositionalParameter` | `$queryRawUnsafe` with constant SQL and `$1` |
| `pgParameterizedQuery` | `pool.query('... $1', [name])` |
| `knexRawWithBindings` | `knex.raw('... ?', [id])` |
| `knexQueryBuilder` | Query builder |
| `constantTemplateWithoutInterpolation` | Template literal with no `${}` |
| `nonSqlQueryMethod` | `.query()` with GraphQL text |
| `conditionalPlaceholderFilter` | `+=` inside an `if` that appends constant SQL with a `$1` placeholder |

## Commands

```bash
semgrep --test --config rules/sql-injection.yml tests/sql-injection.ts
scripts/run-tests.sh
scripts/check-examples.sh
```

## Results

| Date | Semgrep | Result |
|---|---|---|
| 2026-10-25 | 1.180.0 | 7 expected findings and 7 non-findings pass (`1/1: ✓ All tests passed`) |
| 2026-11-03 | 1.180.0 | 14 expected findings and 8 non-findings pass after the v0.1.1 fix; direct scan: 14 findings, no duplicates |
| 2026-11-04 | 1.180.0 | v0.3.0: raw-query rule 16 expected findings and 9 non-findings pass; direct scan: 16 findings, no duplicates. New taint rule `sentinel-sql-injection-tainted-query` (`tests/sql-injection-tainted.ts`): 6 findings and 7 non-findings pass; no line reported by both rules |

## Failures and resolutions

| Date | Problem | Resolution |
|---|---|---|
| 2026-10-25 | Scanning the fixture directly showed every finding reported three or four times on the same line, although `--test` passed (it compares lines only). | The message contained `$1` and `$queryRaw`, which Semgrep treated as metavariables, multiplying results. Reworded the message to reference only `$METHOD`. Re-scan showed one finding per line. |
| 2026-11-03 | Ground-truth benchmark case V-02 (`if (status) sql += ...`) was missed. A minimal reproduction showed the rule tracked `+=` only as a top-level statement. | Added `conditionalFilter` and `conditionalFilterBraced` (both failed first), then `pattern-inside` variants for `if`. |
| 2026-11-03 | Checking related forms found three more misses: `else` branches, loops (`for` without braces, `while`), and clauses starting with `OR x =`, which the keyword check did not recognise. An earlier probe wrongly suggested classic `for` loops were missed; the real cause was the `OR` wording. | Added fixtures for each (all failed first), then `else`/`for`/`while` variants and `or` in the keyword regex. |
| 2026-11-04 | Benchmark V-03 (SQL returned by a helper in the same file) was a known miss. | Added `searchViaHelper`, `orderViaArrowHelper` (both failed first: `missed lines: [190, 195]`) and the `staticViaHelper` negative, then a third branch matching a `function`/arrow helper that returns dynamic SQL. |
| 2026-11-04 | Taint rule, first run: the Sequelize `literal()` case was missed. The method-name regex sat outside its `pattern-either` branch, so it failed for `literal`, where `$FRAGMENT` is not bound. | Moved the regex inside the query-builder branch. |
| 2026-11-04 | Taint rule reported `Prisma.raw(column)` twice: once as a `.raw` call and once by an explicit `Prisma.raw` sink. | Removed the redundant explicit sink. |
| 2026-11-04 | Overlap check: request data interpolated directly in `pool.query(...)` would be reported by both rules. | The taint sink now skips SQL built directly in the call (template or `+`), which the raw-query rule already reports. Fixture `directInterpolation` keeps this as an `ok` case. |

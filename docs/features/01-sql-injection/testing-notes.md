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

## Failures and resolutions

| Date | Problem | Resolution |
|---|---|---|
| 2026-10-25 | Scanning the fixture directly showed every finding reported three or four times on the same line, although `--test` passed (it compares lines only). | The message contained `$1` and `$queryRaw`, which Semgrep treated as metavariables, multiplying results. Reworded the message to reference only `$METHOD`. Re-scan showed one finding per line. |

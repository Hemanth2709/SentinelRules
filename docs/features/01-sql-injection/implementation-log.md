# SQL injection: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-10-25 | Created `sentinel-sql-injection-raw-query` covering `$queryRawUnsafe`, `$executeRawUnsafe`, `query`, `raw`, `execute` with interpolated or concatenated first argument | Establish detection coverage for the documented unsafe raw-query APIs | `semgrep --test` with 7 positive / 7 negative fixtures | Pass |
| 2026-10-25 | Added same-scope variable tracking (`$SQLVAR = ...` and `$SQLVAR += ...`) | SQL is commonly built in a local variable before the call | `prismaUnsafeBuiltInVariable`, `appendedFilter` fixtures | Pass |
| 2026-10-25 | Added SQL-keyword `metavariable-regex` on the SQL argument | Prevent generic `.query()` methods (e.g. GraphQL clients) from matching | `nonSqlQueryMethod` negative fixture | Pass |
| 2026-10-25 | Removed `$1` and `$queryRaw` from the rule message | They were interpreted as metavariables and caused each finding to be reported 3–4 times | Direct scan of fixture: one finding per expected line | Fixed |
| 2026-10-25 | Wrote feature documentation and vulnerable/secure examples | Milestone 1 deliverable | `scripts/check-examples.sh` | Pass |

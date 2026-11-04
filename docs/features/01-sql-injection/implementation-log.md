# SQL injection: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-10-25 | Created `sentinel-sql-injection-raw-query` covering `$queryRawUnsafe`, `$executeRawUnsafe`, `query`, `raw`, `execute` with interpolated or concatenated first argument | Establish detection coverage for the documented unsafe raw-query APIs | `semgrep --test` with 7 positive / 7 negative fixtures | Pass |
| 2026-10-25 | Added same-scope variable tracking (`$SQLVAR = ...` and `$SQLVAR += ...`) | SQL is commonly built in a local variable before the call | `prismaUnsafeBuiltInVariable`, `appendedFilter` fixtures | Pass |
| 2026-10-25 | Added SQL-keyword `metavariable-regex` on the SQL argument | Prevent generic `.query()` methods (e.g. GraphQL clients) from matching | `nonSqlQueryMethod` negative fixture | Pass |
| 2026-10-25 | Removed `$1` and `$queryRaw` from the rule message | They were interpreted as metavariables and caused each finding to be reported 3–4 times | Direct scan of fixture: one finding per expected line | Fixed |
| 2026-10-25 | Wrote feature documentation and vulnerable/secure examples | Milestone 1 deliverable | `scripts/check-examples.sh` | Pass |
| 2026-11-03 | Track `+=` appends inside `if`/`else`, `for` and `while` (with or without braces) | Ground-truth benchmark case V-02: optional filters appended inside an `if` were missed | 7 new `ruleid` fixtures and 1 new `ok` fixture, each new `ruleid` failed before the change; full suite 8/8; no new findings on Event-Booking-NEST-JS or HemanthG | Fixed in v0.1.1 |
| 2026-11-03 | Recognise `or <column> =` in the SQL keyword check | Appended `OR` clauses were filtered out as non-SQL | `orFilter` fixture failed before, passes after; GraphQL `nonSqlQueryMethod` still not reported | Fixed in v0.1.1 |
| 2026-11-04 | Added branch 3: SQL returned by a helper function (`function` or arrow) declared in the same file | Benchmark V-03, documented false negative | Fixtures failed first, then `semgrep --test` pass; benchmark V-03 detected | Pass |
| 2026-11-04 | Added `sentinel-sql-injection-tainted-query` (taint mode, `rules/sql-injection-tainted.yml`) | Roadmap: taint mode for rule 01. Covers helpers in other modules, `.join()`/`format` building, Prisma.raw, Sequelize literal, knex `*Raw` and TypeORM query-builder fragments | Stub rule failed all 6 cases first; `semgrep --test` pass; examples PASS; benchmark V-36 detected | Pass |
| 2026-11-04 | v0.3.0 changes released (tag on `b946320`) | Milestone 6 | Rule patterns identical to the benchmarked commit `7fe1eef` | Released |

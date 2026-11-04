# Rule 11: Mass assignment

| | |
|---|---|
| Rule ID | `sentinel-mass-assignment-unfiltered-body` |
| Rule file | [`rules/mass-assignment.yml`](../../../rules/mass-assignment.yml) |
| Test fixture | [`tests/mass-assignment.ts`](../../../tests/mass-assignment.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/mass-assignment.ts) · [secure](../../../examples/secure/mass-assignment.ts) |
| Severity | WARNING |
| Confidence | MEDIUM |
| CWE | CWE-915 |
| OWASP | A08:2021 Software and Data Integrity Failures, A01:2021 Broken Access Control |
| Status | Released (v0.2.0) |

## Purpose

Flags database writes where the whole client-supplied object is the written value: Prisma `data` / `create` / `update`, TypeORM / Sequelize / Mongoose `update`, `save`, `insert`, `create`, `merge`, `findByIdAndUpdate`, `updateOne`, and `Object.assign(entity, body)`. The object can be passed directly or spread (`{ ...body, ownerId }`).

This is a taint-mode rule: it follows a value from the request to the
dangerous call within one file ([DEC-010](../../decisions/decision-log.md)).

## Running the tests

```bash
semgrep --test --config rules/mass-assignment.yml tests/mass-assignment.ts
```

## Interpreting a finding

Look at which columns the model has. If it has fields a user must not set (`role`, `isAdmin`, `ownerId`, `emailVerified`, `balance`), this is a real vulnerability. If the object was validated by a schema or DTO elsewhere, record the finding with `nosemgrep` and where the validation happens.

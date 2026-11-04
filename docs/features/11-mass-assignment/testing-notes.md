# Mass assignment: testing notes

Fixture: [`tests/mass-assignment.ts`](../../../tests/mass-assignment.ts)

## Expected findings

| Case | Pattern |
|---|---|
| PATCH handler | `data: body` from `await request.json()` |
| POST handler | `data: { ...input, ownerId }` |
| UsersService | `Record<string, unknown>` parameter spread into TypeORM `update` |
| AccountsController.update | `@Body() body: any` spread into `save` |
| AccountsController.create | `@Body() body: Record<...>` into `insert` |
| Express create | `User.create(req.body)` |
| Express patch | `Object.assign(user, req.body)` |

## Expected non-findings

| Case | Pattern |
|---|---|
| PUT handler | picked fields `{ name: body.name, bio: body.bio }` |
| allowlisted | destructured `{ name, bio }` |
| schemaParsed | `UpdateProfileSchema.parse(...)` |
| ProfileController | DTO class with whitelist |
| createSettings | spread of server-side constant defaults |

## Commands

```bash
semgrep --test --config rules/mass-assignment.yml tests/mass-assignment.ts
semgrep scan --metrics=off --config rules/mass-assignment.yml tests/mass-assignment.ts   # duplicate check
scripts/run-tests.sh
```

## Results

- 2026-11-04, Semgrep 1.180.0: `1/1: ✓ All tests passed`. `semgrep scan` on the
  fixture reports one finding per `ruleid` line, no duplicates.
- Failures during development are recorded in the
  [implementation log](implementation-log.md).
- Not yet measured on real applications; see
  [benchmark-results.md](../../benchmark-results.md).

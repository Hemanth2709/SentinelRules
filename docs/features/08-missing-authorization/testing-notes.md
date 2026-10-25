# Missing authorization: testing notes

Fixture: [`tests/missing-authorization.ts`](../../../tests/missing-authorization.ts)

NestJS and Next.js cases share one fixture because Semgrep pairs one test
file with each rule file.

## `sentinel-nestjs-route-missing-guard`

| Case | Expected |
|---|---|
| `InvoicesController.findOne` – `@Get` without guard | finding |
| `InvoicesController.remove` – `@Delete` without guard | finding |
| `InvoicesController.create` – `@UseGuards` before `@Post` | no finding |
| `InvoicesController.health` – `@Public()` | no finding |
| `InvoicesController.toDto` – no route decorator | no finding |
| `AccountsController.findOne` – controller-level `@UseGuards` | no finding |

## `sentinel-nextjs-handler-missing-auth-check`

| Case | Expected |
|---|---|
| `DELETE` without session check | finding |
| `PATCH` without session check | finding |
| `deleteProject` Server Action without session check | finding |
| `POST` with `getServerSession` | no finding |
| `PUT` with `supabase.auth.getUser()` | no finding |
| `GET` (excluded by design) | no finding |
| `renameProject` Server Action with `getServerSession` | no finding |

The `'use server'` directive sits in the middle of the fixture so that only
the Server Action section follows it. In a real project it is the first
statement of the file; the fixture comments explain this.

## Commands

```bash
semgrep --test --config rules/missing-authorization.yml tests/missing-authorization.ts
semgrep --test --config rules/ tests/
```

## Results

| Date | Semgrep | Result |
|---|---|---|
| 2026-10-25 | 1.180.0 | `2/2: ✓ All tests passed` (5 findings, 8 non-findings) |

## Failures and resolutions

| Date | Problem | Resolution |
|---|---|---|
| 2026-10-25 | Validation error: `$PUBLIC` used in `metavariable-regex` but only bound in a `pattern-not`. | Listed `@Public()`, `@SkipAuth()`, `@AllowAnonymous()` as separate `pattern-not` entries. |
| 2026-10-25 | Experiment showed `pattern-not: function $M(...) {...}` does not remove `export async function` matches. | Wrote all negations in the `export function` form. |

## Cross-rule observation

Running the full rule pack over `examples/vulnerable/insecure-cookies.ts` and
`examples/secure/insecure-cookies.ts` reports their `login` routes with this
rule. Login endpoints are intentionally unauthenticated; this is the expected
false-positive class described in [limitations.md](limitations.md). The
example check script runs each example only against its own rule for this
reason.

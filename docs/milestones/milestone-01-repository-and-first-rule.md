# Milestone 1: Repository and first rule

## Milestone metadata

- Milestone number: 1
- Planned deadline: 2026-10-31
- Actual completion date: 2026-10-25
- Status: Complete
- Related Git commits: see [Commits](#commits)
- Related pull requests: none yet

## Objective

Establish the repository structure, tooling, and the workflow for writing,
testing, and documenting a rule, using the SQL injection rule as the first
complete example.

## Planned work

| Task | Acceptance criterion |
|---|---|
| Repository structure | Folders from the project plan created as needed |
| Semgrep installation instructions | `docs/setup-guide.md` with a pinned version |
| Rule-writing tutorial | `docs/rule-writing-guide.md` |
| SQL injection rule | `rules/sql-injection.yml` with real matching logic |
| Fixtures | ≥ 2 positive, ≥ 2 negative, passing |
| Feature documentation | `docs/features/01-sql-injection/` (7 files) |

## Implementation record

- **Structure** – Created `rules/`, `tests/`, `examples/`, `docs/`,
  `scripts/`, `.github/workflows/`. Added `scripts/` (not in the original
  plan) for the example check (DEC-006).
- **Tooling** – Installed Semgrep 1.180.0 with pip and pinned it (DEC-002).
- **Rule** – `sentinel-sql-injection-raw-query`: raw-query sink, dynamic
  first argument (template interpolation, concatenation, `.concat`), same-scope
  variable tracking (`=` and `+=`), SQL-keyword filter. Alternative
  considered: matching all `.query()` calls with templates – rejected because
  GraphQL and HTTP clients use the same method name.
- **Fixtures** – `tests/sql-injection.ts` covers Prisma, node-postgres,
  TypeORM, and Knex.
- **Docs** – Feature folder, setup guide, rule-writing guide, testing guide.

## Testing and validation

| Command | Result |
|---|---|
| `semgrep --test --config rules/sql-injection.yml tests/sql-injection.ts` | `1/1: ✓ All tests passed` (7 `ruleid`, 7 `ok`) |
| Mutation check: all `ok` annotations changed to `ruleid` in a scratch copy | Failed as expected (`missed lines: [...]`), exit status 1 when run without a pipe |
| `semgrep --test rules/` | `No unit tests found`, exit 0 – led to DEC-003 |
| Direct scan of fixture | Found 3–4 duplicate findings per line; fixed by rewording the message |

Remaining issues: none for this milestone.

## Learning notes

- Prisma's tagged `$queryRaw` and `$queryRawUnsafe(\`...\`)` look similar but
  are different syntax nodes; the rule depends on that difference.
- `--test` checks lines, not counts.

## Decisions

DEC-001, DEC-002, DEC-003.

## Known limitations

See [SQL injection limitations](../features/01-sql-injection/limitations.md).

## Completion review

- [x] All required tasks are implemented.
- [x] All required tests pass.
- [x] Documentation is updated.
- [x] Relevant implementation logs are updated.
- [x] Acceptance criteria are satisfied.
- [x] Remaining limitations are recorded.

## Commits

To be recorded after push.

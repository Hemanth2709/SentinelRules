# SQL injection: remediation

## Vulnerable

```ts
findByEmail(email: string) {
  return this.prisma.$queryRawUnsafe(`SELECT id, email FROM "User" WHERE email = '${email}'`);
}

listSorted(sort: string) {
  const sql = 'SELECT id, email FROM "User" ORDER BY ' + sort;
  return this.prisma.$queryRawUnsafe(sql);
}
```

## Corrected

```ts
const SORTABLE_COLUMNS = { email: Prisma.sql`email`, createdAt: Prisma.sql`"createdAt"` } as const;

findByEmail(email: string) {
  return this.prisma.$queryRaw`SELECT id, email FROM "User" WHERE email = ${email}`;
}

listSorted(sort: string) {
  const column = SORTABLE_COLUMNS[sort as keyof typeof SORTABLE_COLUMNS] ?? SORTABLE_COLUMNS.createdAt;
  return this.prisma.$queryRaw`SELECT id, email FROM "User" ORDER BY ${column}`;
}
```

Full files: [vulnerable](../../../examples/vulnerable/sql-injection.ts),
[secure](../../../examples/secure/sql-injection.ts).

## Why this fixes it

- **Values** are sent to the database separately from the SQL text, so the
  database never parses them as SQL.
- **Identifiers** (column and table names, sort direction) cannot be bound
  parameters. They must be chosen from a fixed allowlist in code, never copied
  from input.

## Framework guidance

| Library | Safe form |
|---|---|
| Prisma | Query API, or tagged ``$queryRaw`...${v}` ``; use `Prisma.sql` / `Prisma.join` to compose |
| TypeORM | Query builder with `:name` parameters, or `query('... $1', [v])` |
| node-postgres | `pool.query('... $1', [v])` |
| mysql2 | `connection.execute('... ?', [v])` |
| Knex | Query builder, or `knex.raw('... ?', [v])` / `knex.raw('?? ', [identifier])` |

## Additional controls

- Validate request input with DTOs (see Rule 03), for example `@IsUUID()`.
- Run the application with a database account that has the least privilege
  it needs.
- Avoid returning raw database error messages to clients.

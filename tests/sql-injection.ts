// Test fixtures for rules/sql-injection.yml
// Lines annotated with `ruleid:` must produce a finding on the next line.
// Lines annotated with `ok:` must not.

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import knex from 'knex';
import { DataSource } from 'typeorm';

const prisma = new PrismaClient();
const pool = new Pool();
const db = knex({ client: 'pg' });
declare const dataSource: DataSource;

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

export async function prismaUnsafeTemplate(email: string) {
  // ruleid: sentinel-sql-injection-raw-query
  return prisma.$queryRawUnsafe(`SELECT * FROM "User" WHERE email = '${email}'`);
}

export async function prismaUnsafeExecuteConcat(id: string) {
  // ruleid: sentinel-sql-injection-raw-query
  return prisma.$executeRawUnsafe('DELETE FROM "Session" WHERE "userId" = ' + id);
}

export async function prismaUnsafeBuiltInVariable(sortColumn: string) {
  const sql = `SELECT id, title FROM "Post" ORDER BY ${sortColumn}`;
  // ruleid: sentinel-sql-injection-raw-query
  return prisma.$queryRawUnsafe(sql);
}

export async function pgQueryConcatenation(name: string) {
  // ruleid: sentinel-sql-injection-raw-query
  return pool.query("SELECT * FROM users WHERE name = '" + name + "'");
}

export async function typeormQueryTemplate(status: string) {
  // ruleid: sentinel-sql-injection-raw-query
  return dataSource.query(`UPDATE orders SET status = '${status}' WHERE archived = false`);
}

export async function knexRawTemplate(tenantId: string) {
  // ruleid: sentinel-sql-injection-raw-query
  return db.raw(`select * from invoices where tenant_id = ${tenantId}`);
}

export async function appendedFilter(search: string) {
  let sql = 'SELECT * FROM products WHERE 1 = 1';
  sql += ` AND name LIKE '%${search}%'`;
  // ruleid: sentinel-sql-injection-raw-query
  return pool.query(sql);
}

export async function conditionalFilter(status?: string) {
  // Optional filter appended inside a one-line if (benchmark case V-02).
  let sql = 'SELECT id, total FROM orders WHERE 1 = 1';
  if (status) sql += ` AND status = '${status}'`;
  // ruleid: sentinel-sql-injection-raw-query
  return pool.query(sql);
}

export async function conditionalFilterBraced(category?: string, maxPrice?: number) {
  let sql = 'SELECT * FROM products WHERE 1 = 1';
  if (category) {
    sql += ` AND category = '${category}'`;
  }
  if (maxPrice) {
    sql += ' AND price <= 100';
  }
  // ruleid: sentinel-sql-injection-raw-query
  return pool.query(sql);
}

export async function conditionalFilterElse(mine: boolean, owner: string) {
  let sql = 'SELECT * FROM projects WHERE 1 = 1';
  if (mine) {
    sql += ' AND owner_id = current_user_id()';
  } else {
    sql += ` AND owner_name = '${owner}'`;
  }
  // ruleid: sentinel-sql-injection-raw-query
  return pool.query(sql);
}

export async function loopFilter(tags: string[]) {
  let sql = 'SELECT * FROM posts WHERE 1 = 1';
  for (const tag of tags) {
    sql += ` AND tags LIKE '%${tag}%'`;
  }
  // ruleid: sentinel-sql-injection-raw-query
  return pool.query(sql);
}

export async function loopFilterNoBraces(ids: string[]) {
  let sql = 'SELECT * FROM posts WHERE 1 = 1';
  for (const id of ids) sql += ` AND author_id = '${id}'`;
  // ruleid: sentinel-sql-injection-raw-query
  return pool.query(sql);
}

export async function whileFilter(queue: string[]) {
  let sql = 'SELECT * FROM jobs WHERE 1 = 1';
  while (queue.length) {
    sql += ` AND id = '${queue.pop()}'`;
  }
  // ruleid: sentinel-sql-injection-raw-query
  return pool.query(sql);
}

export async function orFilter(email?: string) {
  let sql = 'SELECT * FROM users WHERE is_admin = true';
  if (email) sql += ` OR email = '${email}'`;
  // ruleid: sentinel-sql-injection-raw-query
  return pool.query(sql);
}

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

export async function prismaTaggedTemplate(email: string) {
  // Prisma's tagged template turns ${email} into a bound parameter.
  // ok: sentinel-sql-injection-raw-query
  return prisma.$queryRaw`SELECT * FROM "User" WHERE email = ${email}`;
}

export async function prismaUnsafeWithPositionalParameter(email: string) {
  // The SQL text is a constant; the value is passed separately as $1.
  // ok: sentinel-sql-injection-raw-query
  return prisma.$queryRawUnsafe('SELECT * FROM "User" WHERE email = $1', email);
}

export async function pgParameterizedQuery(name: string) {
  // ok: sentinel-sql-injection-raw-query
  return pool.query('SELECT * FROM users WHERE name = $1', [name]);
}

export async function knexRawWithBindings(tenantId: string) {
  // ok: sentinel-sql-injection-raw-query
  return db.raw('select * from invoices where tenant_id = ?', [tenantId]);
}

export async function knexQueryBuilder(tenantId: string) {
  // ok: sentinel-sql-injection-raw-query
  return db('invoices').where({ tenant_id: tenantId }).select('*');
}

export async function conditionalPlaceholderFilter(status?: string) {
  // The appended text is constant; the value goes in the parameters array.
  let sql = 'SELECT id, total FROM orders WHERE 1 = 1';
  const params: string[] = [];
  if (status) {
    params.push(status);
    sql += ' AND status = $1';
  }
  // ok: sentinel-sql-injection-raw-query
  return pool.query(sql, params);
}

export async function constantTemplateWithoutInterpolation() {
  // ok: sentinel-sql-injection-raw-query
  return pool.query(`SELECT count(*) FROM users`);
}

export async function nonSqlQueryMethod(client: { query: (q: string) => unknown }, id: string) {
  // A `.query()` call whose text does not look like SQL (e.g. GraphQL).
  // ok: sentinel-sql-injection-raw-query
  return client.query(`{ user(id: "${id}") { name } }`);
}

// ---------------------------------------------------------------------------
// v0.3.0: SQL built by a helper function in the same file (benchmark V-03)
// ---------------------------------------------------------------------------

function buildSearchSql(term: string): string {
  return `SELECT id, name FROM products WHERE name ILIKE '%${term}%'`;
}

const buildOrderSql = (id: string) => 'SELECT * FROM orders WHERE id = ' + id;

function buildStaticSql(): string {
  return 'SELECT id, name FROM products ORDER BY name';
}

export async function searchViaHelper(term: string) {
  // ruleid: sentinel-sql-injection-raw-query
  return dataSource.query(buildSearchSql(term));
}

export async function orderViaArrowHelper(id: string) {
  // ruleid: sentinel-sql-injection-raw-query
  return pool.query(buildOrderSql(id));
}

export async function staticViaHelper() {
  // ok: sentinel-sql-injection-raw-query
  return dataSource.query(buildStaticSql());
}

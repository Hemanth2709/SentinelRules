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

export async function constantTemplateWithoutInterpolation() {
  // ok: sentinel-sql-injection-raw-query
  return pool.query(`SELECT count(*) FROM users`);
}

export async function nonSqlQueryMethod(client: { query: (q: string) => unknown }, id: string) {
  // A `.query()` call whose text does not look like SQL (e.g. GraphQL).
  // ok: sentinel-sql-injection-raw-query
  return client.query(`{ user(id: "${id}") { name } }`);
}

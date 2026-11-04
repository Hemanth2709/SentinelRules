// Test fixtures for rules/sql-injection-tainted.yml (v0.3.0, taint mode).
// Request data reaching a raw SQL fragment through any number of steps,
// including helpers in other modules that this file cannot see.

import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import knex from 'knex';
import { Pool } from 'pg';
import { Sequelize } from 'sequelize';
import { DataSource } from 'typeorm';
import { buildReportSql } from './report-sql';

const prisma = new PrismaClient();
const pool = new Pool();
const db = knex({ client: 'pg' });
const sequelize = new Sequelize('postgres://localhost/app');
declare const dataSource: DataSource;

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

// A helper from another module builds the SQL from the query string.
export async function reportFromQuery(req: Request, res: Response) {
  const sql = buildReportSql(req.query.range as string);
  // ruleid: sentinel-sql-injection-tainted-query
  res.json(await pool.query(sql));
}

// Prisma.raw() inserts text verbatim inside a Prisma.sql template.
export async function sortedUsers(req: Request) {
  const column = req.query.sort as string;
  // ruleid: sentinel-sql-injection-tainted-query
  return prisma.$queryRaw`SELECT * FROM users ORDER BY ${Prisma.raw(column)}`;
}

// Sequelize literal() is raw SQL.
export async function literalFilter(req: Request) {
  return sequelize.models.Order.findAll({
    // ruleid: sentinel-sql-injection-tainted-query
    where: sequelize.literal(`status = '${req.body.status}'`),
  });
}

// knex raw fragments.
export async function knexOrder(req: Request) {
  // ruleid: sentinel-sql-injection-tainted-query
  return db('orders').orderByRaw(req.query.order as string);
}

// TypeORM query builder conditions are SQL text.
@Controller('orders')
export class OrdersController {
  @Get()
  find(@Query('status') status: string) {
    return dataSource
      .createQueryBuilder()
      .select('*')
      .from('orders', 'o')
      // ruleid: sentinel-sql-injection-tainted-query
      .where(`o.status = '${status}'`)
      .getRawMany();
  }

  @Get(':table')
  dump(@Param('table') table: string) {
    const sql = ['SELECT * FROM', table].join(' ');
    // ruleid: sentinel-sql-injection-tainted-query
    return dataSource.query(sql);
  }
}

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

// Interpolated directly in the call: reported by sentinel-sql-injection-raw-query
// instead, so this rule stays quiet to avoid a duplicate finding.
export async function directInterpolation(req: Request) {
  // ok: sentinel-sql-injection-tainted-query
  return pool.query(`SELECT * FROM orders WHERE status = '${req.query.status}'`);
}

export async function boundParameter(req: Request) {
  // ok: sentinel-sql-injection-tainted-query
  return pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
}

export async function taggedTemplate(req: Request) {
  // Prisma's tagged template sends values as bind parameters.
  // ok: sentinel-sql-injection-tainted-query
  return prisma.$queryRaw`SELECT * FROM users WHERE email = ${req.body.email}`;
}

export async function numericId(req: Request) {
  const id = Number(req.params.id);
  // ok: sentinel-sql-injection-tainted-query
  return pool.query(`SELECT * FROM orders WHERE id = ${id}`);
}

const SORT_COLUMNS: Record<string, string> = { newest: 'created_at DESC', total: 'total DESC' };

export async function allowlistedSort(req: Request) {
  const order = SORT_COLUMNS[req.query.sort as string] ?? 'created_at DESC';
  // ok: sentinel-sql-injection-tainted-query
  return db('orders').orderByRaw(order);
}

export class SafeController {
  @Get()
  find(@Query('status') status: string) {
    // ok: sentinel-sql-injection-tainted-query
    return dataSource.createQueryBuilder().select('*').from('orders', 'o').where('o.status = :status', { status }).getRawMany();
  }

  // A constant fragment is not request data.
  @Get('recent')
  recent(@Body() _body: unknown) {
    // ok: sentinel-sql-injection-tainted-query
    return db('orders').orderByRaw('created_at DESC');
  }
}

// VULNERABLE EXAMPLE - do not copy into production code.
// src/reports/reports.controller.ts (NestJS + TypeORM)

import { Controller, Get, Query } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { buildDateFilter } from './sql-helpers';

@Controller('reports')
export class ReportsController {
  constructor(private readonly dataSource: DataSource) {}

  // GET /reports?from=2026-01-01&sort=total
  @Get()
  async sales(@Query('from') from: string, @Query('sort') sort: string) {
    // The helper lives in another module and returns `created_at >= '${from}'`.
    // A caller can send from=' OR '1'='1 to read every row.
    const where = buildDateFilter(from);
    return this.dataSource
      .createQueryBuilder()
      .select(['id', 'customer_id', 'total'])
      .from('orders', 'o')
      .where(where)
      // Column names cannot be bound as parameters; this one comes straight
      // from the query string.
      .orderBy(sort)
      .getRawMany();
  }
}

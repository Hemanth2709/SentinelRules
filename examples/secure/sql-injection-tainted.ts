// SECURE EXAMPLE
// src/reports/reports.controller.ts (NestJS + TypeORM)

import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { DataSource } from 'typeorm';

// Identifiers cannot be bound, so they are chosen from a fixed allowlist.
const SORT_COLUMNS: Record<string, string> = { total: 'o.total', newest: 'o.created_at' };

@Controller('reports')
export class ReportsController {
  constructor(private readonly dataSource: DataSource) {}

  // GET /reports?from=2026-01-01&sort=total
  @Get()
  async sales(@Query('from') from: string, @Query('sort') sort: string) {
    if (Number.isNaN(Date.parse(from))) throw new BadRequestException('from must be a date');
    const column = SORT_COLUMNS[sort] ?? 'o.created_at';
    return this.dataSource
      .createQueryBuilder()
      .select(['id', 'customer_id', 'total'])
      .from('orders', 'o')
      // Values are sent separately from the SQL text as bind parameters.
      .where('o.created_at >= :from', { from })
      .orderBy(column, 'DESC')
      .getRawMany();
  }
}

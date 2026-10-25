// SECURE EXAMPLE
// The same service using bound parameters and an allowlist for identifiers.

import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

const SORTABLE_COLUMNS = { email: Prisma.sql`email`, createdAt: Prisma.sql`"createdAt"` } as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaClient) {}

  findByEmail(email: string) {
    // The tagged template sends `email` as a bound parameter, not as SQL text.
    return this.prisma.$queryRaw`SELECT id, email FROM "User" WHERE email = ${email}`;
  }

  listSorted(sort: string) {
    // Identifiers (column names) cannot be bound parameters, so map user
    // input onto a fixed allowlist instead of interpolating it.
    const column = SORTABLE_COLUMNS[sort as keyof typeof SORTABLE_COLUMNS] ?? SORTABLE_COLUMNS.createdAt;
    return this.prisma.$queryRaw`SELECT id, email FROM "User" ORDER BY ${column}`;
  }
}

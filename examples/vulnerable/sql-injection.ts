// VULNERABLE EXAMPLE - do not copy into production code.
// A NestJS service that builds SQL by interpolating request input.

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaClient) {}

  // GET /users?email=... -> email is attacker-controlled.
  findByEmail(email: string) {
    // An input such as  ' OR '1'='1  changes the WHERE clause.
    return this.prisma.$queryRawUnsafe(`SELECT id, email FROM "User" WHERE email = '${email}'`);
  }

  // GET /users?sort=... -> sort is attacker-controlled.
  listSorted(sort: string) {
    const sql = 'SELECT id, email FROM "User" ORDER BY ' + sort;
    return this.prisma.$queryRawUnsafe(sql);
  }
}

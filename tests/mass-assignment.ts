// Test fixtures for rules/mass-assignment.yml

import { Body, Controller, Injectable, Param, Patch, Post } from '@nestjs/common';
import express, { Request as ExpressRequest, Response } from 'express';
import { z } from 'zod';

declare const prisma: any;
declare const dataSource: any;
declare const User: any;
declare function getSession(): Promise<{ userId: string }>;
const app = express();

class UpdateProfileDto {
  name!: string;
  bio?: string;
}

const UpdateProfileSchema = z.object({ name: z.string(), bio: z.string().optional() });

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

// Next.js route handler: the parsed JSON body is the Prisma `data`.
export async function PATCH(request: Request) {
  const session = await getSession();
  const body = await request.json();
  // ruleid: sentinel-mass-assignment-unfiltered-body
  await prisma.user.update({ where: { id: session.userId }, data: body });
  return Response.json({ ok: true });
}

// Spread into `data`, with a server-side field added.
export async function POST(request: Request) {
  const session = await getSession();
  const input = await request.json();
  await prisma.project.create({
    // ruleid: sentinel-mass-assignment-unfiltered-body
    data: { ...input, ownerId: session.userId },
  });
  return Response.json({ ok: true });
}

// Service method that writes every key of a loose record (TypeORM).
@Injectable()
export class UsersService {
  async updateProfile(id: string, changes: Record<string, unknown>) {
    // ruleid: sentinel-mass-assignment-unfiltered-body
    return dataSource.getRepository('users').update(id, { ...changes });
  }
}

// NestJS: an untyped @Body() saved directly.
@Controller('accounts')
export class AccountsController {
  constructor(private readonly repo: any) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    // ruleid: sentinel-mass-assignment-unfiltered-body
    return this.repo.save({ id, ...body });
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    // ruleid: sentinel-mass-assignment-unfiltered-body
    return this.repo.insert(body);
  }
}

// Express: req.body passed whole to a model, and merged into an entity.
app.post('/users', async (req: ExpressRequest, res: Response) => {
  // ruleid: sentinel-mass-assignment-unfiltered-body
  const user = await User.create(req.body);
  res.json(user);
});

app.patch('/users/:id', async (req: ExpressRequest, res: Response) => {
  const user = await User.findByPk(req.params.id);
  // ruleid: sentinel-mass-assignment-unfiltered-body
  Object.assign(user, req.body);
  await user.save();
  res.json(user);
});

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

// Fields picked explicitly.
export async function PUT(request: Request) {
  const session = await getSession();
  const body = await request.json();
  await prisma.user.update({
    where: { id: session.userId },
    // ok: sentinel-mass-assignment-unfiltered-body
    data: { name: body.name, bio: body.bio },
  });
  return Response.json({ ok: true });
}

// Destructured allowlist.
export async function allowlisted(request: Request) {
  const session = await getSession();
  const { name, bio } = await request.json();
  // ok: sentinel-mass-assignment-unfiltered-body
  await prisma.user.update({ where: { id: session.userId }, data: { name, bio } });
}

// Validated with a schema that strips unknown keys.
export async function schemaParsed(request: Request) {
  const session = await getSession();
  const data = UpdateProfileSchema.parse(await request.json());
  // ok: sentinel-mass-assignment-unfiltered-body
  await prisma.user.update({ where: { id: session.userId }, data });
}

// NestJS DTO class: with ValidationPipe({ whitelist: true }) unknown keys are
// stripped (Rule 03 checks that setting).
@Controller('profile')
export class ProfileController {
  constructor(private readonly repo: any) {}

  @Patch()
  update(@Body() dto: UpdateProfileDto) {
    // ok: sentinel-mass-assignment-unfiltered-body
    return this.repo.update('me', dto);
  }
}

// Spread of server-side defaults only.
const DEFAULT_SETTINGS = { theme: 'light', emails: true };
export async function createSettings(userId: string) {
  // ok: sentinel-mass-assignment-unfiltered-body
  return prisma.settings.create({ data: { ...DEFAULT_SETTINGS, userId } });
}

// Test fixtures for rules/missing-authorization.yml
//
// NestJS controllers and Next.js handlers normally live in separate files.
// They share one fixture here because Semgrep pairs one test file with each
// rule file.

import { Body, Controller, Delete, Get, Param, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

declare const AuthGuard: any;
declare const RolesGuard: any;
declare const authOptions: any;
declare const db: any;
declare const supabase: any;
const Public = () => SetMetadata('isPublic', true);

// ---------------------------------------------------------------------------
// sentinel-nestjs-route-missing-guard
// ---------------------------------------------------------------------------

@Controller('invoices')
export class InvoicesController {
  @Get(':id')
  // ruleid: sentinel-nestjs-route-missing-guard
  findOne(@Param('id') id: string) {
    return db.invoice.findUnique({ where: { id } });
  }

  @Delete(':id')
  // ruleid: sentinel-nestjs-route-missing-guard
  remove(@Param('id') id: string) {
    return db.invoice.delete({ where: { id } });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  // ok: sentinel-nestjs-route-missing-guard
  create(@Body() body: unknown) {
    return db.invoice.create({ data: body });
  }

  @Public()
  @Get('health')
  // ok: sentinel-nestjs-route-missing-guard
  health() {
    return { status: 'ok' };
  }

  // Not a route handler: no HTTP method decorator.
  // ok: sentinel-nestjs-route-missing-guard
  private toDto(invoice: unknown) {
    return invoice;
  }
}

@UseGuards(AuthGuard)
@Controller('accounts')
export class AccountsController {
  @Get(':id')
  // ok: sentinel-nestjs-route-missing-guard
  findOne(@Param('id') id: string) {
    return db.account.findUnique({ where: { id } });
  }
}

// ---------------------------------------------------------------------------
// sentinel-nextjs-handler-missing-auth-check
// ---------------------------------------------------------------------------

// ruleid: sentinel-nextjs-handler-missing-auth-check
export async function DELETE(request: Request) {
  const { id } = await request.json();
  await db.project.delete({ where: { id } });
  return NextResponse.json({ deleted: id });
}

// ruleid: sentinel-nextjs-handler-missing-auth-check
export async function PATCH(request: Request) {
  const body = await request.json();
  return NextResponse.json(await db.project.update({ where: { id: body.id }, data: body }));
}

// ok: sentinel-nextjs-handler-missing-auth-check
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  return NextResponse.json(await db.project.create({ data: { ...body, ownerId: session.user.id } }));
}

// ok: sentinel-nextjs-handler-missing-auth-check
export async function PUT(request: Request) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

// GET handlers are not reported by default.
// ok: sentinel-nextjs-handler-missing-auth-check
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

// ---------------------------------------------------------------------------
// Server Actions
//
// In a real project 'use server' is the first statement of an actions file.
// It is placed here, at the end of the shared fixture, because the rule only
// treats functions that follow the directive as Server Actions.
// ---------------------------------------------------------------------------

'use server';

// ruleid: sentinel-nextjs-handler-missing-auth-check
export async function deleteProject(projectId: string) {
  await db.project.delete({ where: { id: projectId } });
}

// ok: sentinel-nextjs-handler-missing-auth-check
export async function renameProject(projectId: string, name: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  await db.project.update({ where: { id: projectId, ownerId: session.user.id }, data: { name } });
}

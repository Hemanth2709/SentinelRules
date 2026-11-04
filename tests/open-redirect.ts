// Test fixtures for rules/open-redirect.yml

import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import express, { Request as ExpressRequest, Response } from 'express';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

const app = express();
declare function isSafeRedirect(path: string): boolean;
declare function safeRedirectPath(path: string | null): string;

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

// Next.js route handler: `next` resolved against the request URL. An absolute
// URL in `next` replaces the base entirely.
export async function GET(request: Request) {
  const next = new URL(request.url).searchParams.get('next') ?? '/';
  // ruleid: sentinel-open-redirect-user-controlled-url
  return NextResponse.redirect(new URL(next, request.url));
}

// NextRequest in middleware-style code.
export function middleware(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get('returnTo');
  // ruleid: sentinel-open-redirect-user-controlled-url
  return NextResponse.redirect(returnTo as string);
}

// Server Action: redirect() from next/navigation with a form field.
export async function continueAction(formData: FormData) {
  'use server';
  const target = formData.get('redirectTo') as string;
  // ruleid: sentinel-open-redirect-user-controlled-url
  redirect(target);
}

// Express: res.redirect with a query parameter.
app.get('/logout', (req: ExpressRequest, res: Response) => {
  // ruleid: sentinel-open-redirect-user-controlled-url
  res.redirect(String(req.query.next));
});

// NestJS: @Query() into res.redirect, and into a returned { url } for @Redirect().
@Controller('auth')
export class AuthController {
  @Get('callback')
  callback(@Query('state') state: string, @Res() res: Response) {
    // ruleid: sentinel-open-redirect-user-controlled-url
    return res.redirect(state);
  }

  @Get('go')
  @Redirect('/', 302)
  go(@Query('to') to: string) {
    // ruleid: sentinel-open-redirect-user-controlled-url
    return { url: to, statusCode: 302 };
  }
}

// Web API Response.redirect.
export async function PUT(request: Request) {
  const { location } = await request.json();
  // ruleid: sentinel-open-redirect-user-controlled-url
  return Response.redirect(location, 303);
}

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

// Constant destination.
export function constantRedirect() {
  // ok: sentinel-open-redirect-user-controlled-url
  return NextResponse.redirect('https://example.com/login');
}

// User value only chooses from a fixed map of destinations.
const DESTINATIONS: Record<string, string> = { home: '/', account: '/account' };
export async function fromMap(request: Request) {
  const key = new URL(request.url).searchParams.get('to') ?? 'home';
  // ok: sentinel-open-redirect-user-controlled-url
  return NextResponse.redirect(new URL(DESTINATIONS[key] ?? '/', request.url));
}

// Validated as a same-site path first.
export async function validated(request: Request) {
  const next = new URL(request.url).searchParams.get('next') ?? '/';
  if (!isSafeRedirect(next)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  // ok: sentinel-open-redirect-user-controlled-url
  return NextResponse.redirect(new URL(next, request.url));
}

// Passed through a sanitizing helper.
export async function sanitized(formData: FormData) {
  'use server';
  // ok: sentinel-open-redirect-user-controlled-url
  redirect(safeRedirectPath(formData.get('redirectTo') as string));
}

// A user value in the path of a fixed destination.
app.get('/orders/:id', (req: ExpressRequest, res: Response) => {
  // ok: sentinel-open-redirect-user-controlled-url
  res.redirect(`/account/orders/${encodeURIComponent(req.params.id)}`);
});

// NestJS handler returning data, not a redirect.
@Controller('search')
export class SearchController {
  @Get()
  search(@Query('q') q: string) {
    // ok: sentinel-open-redirect-user-controlled-url
    return { query: q, results: [] };
  }
}

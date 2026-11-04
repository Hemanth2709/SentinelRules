// VULNERABLE EXAMPLE - do not copy into production code.
// app/auth/callback/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const next = new URL(request.url).searchParams.get('next') ?? '/';
  // An absolute URL in `next` replaces the base, so
  // /auth/callback?next=https://evil.example/login sends a freshly signed-in
  // user to a look-alike page on another site.
  return NextResponse.redirect(new URL(next, request.url));
}

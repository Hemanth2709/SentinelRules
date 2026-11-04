// SECURE EXAMPLE
// app/auth/callback/route.ts

import { NextResponse } from 'next/server';

// Same-site path only: one leading "/", not "//" or "/\" (both are treated as
// protocol-relative URLs by browsers).
function isSafeRedirect(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\');
}

export async function GET(request: Request) {
  const next = new URL(request.url).searchParams.get('next') ?? '/';
  if (!isSafeRedirect(next)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.redirect(new URL(next, request.url));
}

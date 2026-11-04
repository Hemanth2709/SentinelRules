// Test fixtures for rules/insecure-cookies.yml

import { Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

declare const sessionId: string;
declare const accessToken: string;

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Res({ passthrough: true }) res: Response) {
    // ruleid: sentinel-insecure-session-cookie
    res.cookie('session_id', sessionId);
    return { ok: true };
  }

  @Post('refresh')
  refresh(@Res({ passthrough: true }) res: Response) {
    // httpOnly present, but secure and sameSite are missing.
    // ruleid: sentinel-insecure-session-cookie
    res.cookie('refresh_token', accessToken, { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 });
    return { ok: true };
  }

  @Post('legacy')
  legacy(@Res({ passthrough: true }) res: Response) {
    // All attributes present, but Secure is explicitly disabled.
    // ruleid: sentinel-insecure-session-cookie
    res.cookie('auth', accessToken, { httpOnly: true, secure: false, sameSite: 'lax' });
    return { ok: true };
  }
}

export async function loginAction() {
  // ruleid: sentinel-insecure-session-cookie
  (await cookies()).set('session', sessionId, { secure: true, sameSite: 'lax' });
}

export function GET() {
  const response = NextResponse.json({ ok: true });
  // ruleid: sentinel-insecure-session-cookie
  response.cookies.set('access_token', accessToken, { httpOnly: false, secure: true, sameSite: 'strict' });
  return response;
}

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

@Controller('secure-auth')
export class SecureAuthController {
  @Post('login')
  login(@Res({ passthrough: true }) res: Response) {
    // ok: sentinel-insecure-session-cookie
    res.cookie('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { ok: true };
  }
}

export async function secureLoginAction() {
  // ok: sentinel-insecure-session-cookie
  (await cookies()).set('session', sessionId, { sameSite: 'strict', httpOnly: true, secure: true });
}

export function setPreferences(res: Response) {
  // Not a session/credential cookie: a UI preference readable by client JS.
  // ok: sentinel-insecure-session-cookie
  res.cookie('theme', 'dark', { sameSite: 'lax' });
}

export function cacheSet(cache: Map<string, string>) {
  // Map.set is not a cookie API.
  // ok: sentinel-insecure-session-cookie
  cache.set('token', accessToken);
}

// ---------------------------------------------------------------------------
// v0.3.0: options from a constant in the same file
// ---------------------------------------------------------------------------

// Benchmark V-14: shared options with httpOnly false and no Secure/SameSite.
const REMEMBER_ME_COOKIE_OPTIONS = { httpOnly: false, maxAge: 30 * 24 * 3600 * 1000 };
const SESSION_COOKIE_OPTIONS = { httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/' };
const DEV_COOKIE_OPTIONS = { httpOnly: true, secure: false, sameSite: 'lax' as const };

export function rememberMe(res: Response, token: string) {
  // ruleid: sentinel-insecure-session-cookie
  res.cookie('remember_token', token, REMEMBER_ME_COOKIE_OPTIONS);
}

export function devSession(res: Response, token: string) {
  // ruleid: sentinel-insecure-session-cookie
  res.cookie('session', token, DEV_COOKIE_OPTIONS);
}

export async function nextSessionFromConstant(token: string) {
  // ruleid: sentinel-insecure-session-cookie
  (await cookies()).set('auth_token', token, REMEMBER_ME_COOKIE_OPTIONS);
}

export function secureSession(res: Response, token: string) {
  // ok: sentinel-insecure-session-cookie
  res.cookie('session', token, SESSION_COOKIE_OPTIONS);
}

// Not a session-like name.
export function themeFromConstant(res: Response) {
  // ok: sentinel-insecure-session-cookie
  res.cookie('theme', 'dark', REMEMBER_ME_COOKIE_OPTIONS);
}

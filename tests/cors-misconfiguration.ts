// Test fixtures for rules/cors-misconfiguration.yml

import { NestFactory } from '@nestjs/core';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

declare const AppModule: unknown;
const app = express();

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

export async function bootstrapReflectAll() {
  const nestApp = await NestFactory.create(AppModule);
  // ruleid: sentinel-cors-credentials-any-origin
  nestApp.enableCors({ origin: true, credentials: true });
  await nestApp.listen(3000);
}

export async function bootstrapViaFactoryOptions() {
  const nestApp = await NestFactory.create(AppModule, {
    // ruleid: sentinel-cors-credentials-any-origin
    cors: { credentials: true, methods: ['GET', 'POST'], origin: true },
  });
  await nestApp.listen(3000);
}

app.use(
  // ruleid: sentinel-cors-credentials-any-origin
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }),
);

export function manualCorsHeaders(req: Request, res: Response, next: NextFunction) {
  // ruleid: sentinel-cors-credentials-any-origin
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin as string);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
}

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

const allowedOrigins = ['https://app.example.com', 'https://admin.example.com'];

export async function bootstrapAllowlist() {
  const nestApp = await NestFactory.create(AppModule);
  // ok: sentinel-cors-credentials-any-origin
  nestApp.enableCors({ origin: allowedOrigins, credentials: true });
  await nestApp.listen(3000);
}

app.use(
  // ok: sentinel-cors-credentials-any-origin
  cors({
    origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
    credentials: true,
  }),
);

// Public, uncredentialed API: any origin may read it, but no cookies are sent.
// ok: sentinel-cors-credentials-any-origin
app.use(cors({ origin: true, credentials: false }));

export function manualAllowlistedHeaders(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    // ok: sentinel-cors-credentials-any-origin
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  next();
}

// ---------------------------------------------------------------------------
// v0.3.0: Web Fetch API headers (Next.js route handlers, middleware)
// ---------------------------------------------------------------------------

// Benchmark V-10: the request Origin is reflected together with credentials.
export function previewHeaders(request: globalThis.Request, response: globalThis.Response) {
  // ruleid: sentinel-cors-credentials-any-origin
  response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') ?? '');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export function middlewareHeaders(req: globalThis.Request, headers: Headers) {
  // ruleid: sentinel-cors-credentials-any-origin
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Origin', req.headers.get('Origin') as string);
  return headers;
}

// Reflected, but without credentials: not this rule's concern.
export function publicFetchHeaders(request: globalThis.Request, response: globalThis.Response) {
  // ok: sentinel-cors-credentials-any-origin
  response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') ?? '*');
  return response;
}

// A fixed origin with credentials is fine.
export function fixedFetchHeaders(response: globalThis.Response) {
  // ok: sentinel-cors-credentials-any-origin
  response.headers.set('Access-Control-Allow-Origin', 'https://app.example.com');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

// ---------------------------------------------------------------------------
// sentinel-cors-weak-origin-check (v0.3.0)
// ---------------------------------------------------------------------------

// Benchmark V-11: 'evil-example.com' also ends with 'example.com'.
export async function bootstrapSuffix() {
  const nestApp = await NestFactory.create(AppModule);
  nestApp.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) =>
      // ruleid: sentinel-cors-weak-origin-check
      callback(null, !origin || origin.endsWith('example.com')),
    credentials: true,
  });
}

app.use(
  cors({
    origin(origin, callback) {
      // ruleid: sentinel-cors-weak-origin-check
      if (origin && origin.includes('example.com')) return callback(null, true);
      callback(new Error('blocked'));
    },
  }),
);

export function regexCheck(req: Request, res: Response) {
  const origin = req.headers.origin ?? '';
  // ruleid: sentinel-cors-weak-origin-check
  if (/example\.com$/.test(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
}

export function prefixCheck(req: Request, res: Response) {
  const origin = req.headers.origin ?? '';
  // 'https://example.com.attacker.net' starts with this too.
  // ruleid: sentinel-cors-weak-origin-check
  if (origin.startsWith('https://example.com')) res.setHeader('Access-Control-Allow-Origin', origin);
}

// A leading dot limits the match to real subdomains.
export function dotSuffix(origin: string) {
  // ok: sentinel-cors-weak-origin-check
  return origin.endsWith('.example.com') || origin === 'https://example.com';
}

// Anchored regex.
export function anchoredRegex(origin: string) {
  // ok: sentinel-cors-weak-origin-check
  return /^https:\/\/([a-z0-9-]+\.)?example\.com$/.test(origin);
}

// Array membership is exact.
export function exactList(origin: string) {
  // ok: sentinel-cors-weak-origin-check
  return allowedOrigins.includes(origin);
}

// A prefix check that ends at the path separator cannot be extended with a host.
export function prefixWithSlash(origin: string) {
  // ok: sentinel-cors-weak-origin-check
  return `${origin}/`.startsWith('https://example.com/');
}

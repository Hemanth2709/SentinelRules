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

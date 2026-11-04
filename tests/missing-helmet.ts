// Test fixtures for rules/missing-helmet.yml

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import helmet from 'helmet';

declare const AppModule: unknown;

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

// NestJS bootstrap with no helmet() before listen().
export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['https://app.example.com'] });
  // ruleid: sentinel-missing-helmet
  await app.listen(3000);
}

// Generic type argument on create().
export async function bootstrapTyped() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  // ruleid: sentinel-missing-helmet
  await app.listen(process.env.PORT ?? 3000);
}

// Express app with no helmet().
export function startExpress() {
  const server = express();
  server.use(express.json());
  server.get('/health', (_req, res) => res.send('ok'));
  // ruleid: sentinel-missing-helmet
  server.listen(8080);
}

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

// helmet() registered before listen().
export async function bootstrapWithHelmet() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  // ok: sentinel-missing-helmet
  await app.listen(3000);
}

// helmet() with options.
export async function bootstrapWithHelmetOptions() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } } }));
  app.enableShutdownHooks();
  // ok: sentinel-missing-helmet
  await app.listen(3000);
}

// Fastify adapter: @fastify/helmet registered.
declare const fastifyHelmet: unknown;
export async function bootstrapFastify() {
  const app = await NestFactory.create(AppModule);
  await (app as any).register(fastifyHelmet);
  // ok: sentinel-missing-helmet
  await app.listen(3000, '0.0.0.0');
}

// Express app with helmet().
export function startExpressWithHelmet() {
  const server = express();
  server.use(helmet());
  // ok: sentinel-missing-helmet
  server.listen(8080);
}

// listen() on something that is not a NestJS or Express app.
declare const queue: { listen(port: number): void };
export function startQueue() {
  // ok: sentinel-missing-helmet
  queue.listen(5672);
}

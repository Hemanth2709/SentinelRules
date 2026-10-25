// SECURE EXAMPLE

import { NestFactory } from '@nestjs/core';

declare const AppModule: unknown;

const ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS ?? 'https://app.example.com')
  .split(',')
  .map((origin) => origin.trim());

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // Exact-match allowlist; no substring or regex checks on the origin.
    origin: ALLOWED_ORIGINS,
    credentials: true,
  });
  await app.listen(3000);
}

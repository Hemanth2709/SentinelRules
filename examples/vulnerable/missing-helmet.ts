// VULNERABLE EXAMPLE - do not copy into production code.
// src/main.ts

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

declare const AppModule: unknown;

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // No security headers: responses can be framed by other sites
  // (clickjacking), MIME types can be sniffed, and there is no
  // Content-Security-Policy to limit injected scripts.
  await app.listen(3000);
}

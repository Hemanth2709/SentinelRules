// SECURE EXAMPLE
// src/main.ts

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

declare const AppModule: unknown;

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Register helmet first so every route, including error responses,
  // gets the security headers.
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}

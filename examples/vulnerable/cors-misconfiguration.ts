// VULNERABLE EXAMPLE - do not copy into production code.

import { NestFactory } from '@nestjs/core';

declare const AppModule: unknown;

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // `origin: true` reflects whatever Origin the browser sends. Combined with
  // credentials, https://evil.example can call this API with the victim's
  // cookies and read the responses.
  app.enableCors({ origin: true, credentials: true });
  await app.listen(3000);
}

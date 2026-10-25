// VULNERABLE EXAMPLE - do not copy into production code.

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IsEmail, IsString } from 'class-validator';

declare const AppModule: unknown;

export class UpdateProfileDto {
  @IsString()
  displayName!: string;

  @IsEmail()
  email!: string;
}

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Without whitelist, a body such as
  //   { "displayName": "x", "email": "a@b.c", "role": "admin" }
  // reaches the handler with `role` intact. If the handler spreads the DTO
  // into an ORM update, the client has changed its own role.
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}

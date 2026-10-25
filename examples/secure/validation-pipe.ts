// SECURE EXAMPLE

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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties without validation decorators
      forbidNonWhitelisted: true, // or reject the request outright
      transform: true,
    }),
  );
  await app.listen(3000);
}

// Test fixtures for rules/validation-pipe.yml

import { Body, Controller, Module, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { APP_PIPE, NestFactory } from '@nestjs/core';

declare const AppModule: unknown;
declare const sharedValidationOptions: Record<string, unknown>;
class CreateUserDto {}

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

export async function bootstrapWithDefaults() {
  const app = await NestFactory.create(AppModule);
  // ruleid: sentinel-nestjs-validation-pipe-missing-whitelist
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

export async function bootstrapWithTransformOnly() {
  const app = await NestFactory.create(AppModule);
  // ruleid: sentinel-nestjs-validation-pipe-missing-whitelist
  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidUnknownValues: true }));
  await app.listen(3000);
}

@Controller('users')
export class UsersController {
  @Post()
  // ruleid: sentinel-nestjs-validation-pipe-missing-whitelist
  @UsePipes(new ValidationPipe({ whitelist: false }))
  create(@Body() dto: CreateUserDto) {
    return dto;
  }
}

@Module({
  providers: [
    // ruleid: sentinel-nestjs-validation-pipe-missing-whitelist
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class ValidationModuleWithDefaults {}

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

export async function bootstrapWithWhitelist() {
  const app = await NestFactory.create(AppModule);
  // ok: sentinel-nestjs-validation-pipe-missing-whitelist
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(3000);
}

@Controller('accounts')
export class AccountsController {
  @Post()
  create(
    // ok: sentinel-nestjs-validation-pipe-missing-whitelist
    @Body(new ValidationPipe({ transform: true, whitelist: true })) dto: CreateUserDto,
  ) {
    return dto;
  }
}

@Module({
  providers: [
    {
      provide: APP_PIPE,
      // ok: sentinel-nestjs-validation-pipe-missing-whitelist
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class ValidationModuleWithWhitelist {}

export async function bootstrapWithSharedOptions() {
  const app = await NestFactory.create(AppModule);
  // Options defined elsewhere cannot be inspected by this rule; not reported.
  // ok: sentinel-nestjs-validation-pipe-missing-whitelist
  app.useGlobalPipes(new ValidationPipe(sharedValidationOptions));
}

export async function bootstrapWithSpreadOptions() {
  const app = await NestFactory.create(AppModule);
  // A spread may provide whitelist; cannot be inspected, not reported.
  // ok: sentinel-nestjs-validation-pipe-missing-whitelist
  app.useGlobalPipes(new ValidationPipe({ ...sharedValidationOptions, transform: true }));
}

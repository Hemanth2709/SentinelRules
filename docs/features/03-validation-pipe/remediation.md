# ValidationPipe: remediation

## Vulnerable

```ts
app.useGlobalPipes(new ValidationPipe({ transform: true }));
```

## Corrected

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // strip properties without validation decorators
    forbidNonWhitelisted: true, // or reject the request outright
    transform: true,
  }),
);
```

Full files: [vulnerable](../../../examples/vulnerable/validation-pipe.ts),
[secure](../../../examples/secure/validation-pipe.ts).

## Why this fixes it

With `whitelist: true`, properties without a `class-validator` decorator are
removed before the handler runs. `forbidNonWhitelisted: true` returns a 400
error instead, which also makes probing visible in logs.

## Framework guidance

- Register one global pipe with `whitelist: true` in `main.ts` or as an
  `APP_PIPE` provider so that every route gets the same behaviour.
- Use separate DTOs for create, update, and admin operations; never declare
  fields such as `role` on a DTO used by ordinary users.
- Decorate nested objects with `@ValidateNested()` and `@Type(() => Child)`,
  otherwise their properties are not whitelisted.

## Additional controls

- Map DTOs to persistence objects explicitly
  (`data: { displayName: dto.displayName }`) instead of spreading.
- Enforce authorization for sensitive fields in the service layer.

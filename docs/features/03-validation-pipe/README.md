# Rule 03: NestJS ValidationPipe without `whitelist: true`

| | |
|---|---|
| Rule ID | `sentinel-nestjs-validation-pipe-missing-whitelist` |
| Rule file | [`rules/validation-pipe.yml`](../../../rules/validation-pipe.yml) |
| Test fixture | [`tests/validation-pipe.ts`](../../../tests/validation-pipe.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/validation-pipe.ts) · [secure](../../../examples/secure/validation-pipe.ts) |
| Severity | WARNING |
| Confidence | MEDIUM |
| CWE | CWE-915 |
| OWASP | A08:2021 Software and Data Integrity Failures, A04:2021 Insecure Design |
| Status | Tested |

## Purpose

Flags `ValidationPipe` instances whose options are visible and do not set
`whitelist: true`, so properties without validation decorators reach route
handlers unchanged.

## What is reported

- `new ValidationPipe()` – global, controller, method, or parameter scope.
- `new ValidationPipe({ ... })` where the inline options do not contain
  `whitelist: true`.
- `{ provide: APP_PIPE, useClass: ValidationPipe }` – Nest creates the pipe
  with default options.

## Running the tests

```bash
semgrep --test --config rules/validation-pipe.yml tests/validation-pipe.ts
```

## Interpreting a finding

Check whether any handler behind this pipe copies the DTO into a persistence
call (`prisma.user.update({ data: dto })`, `repository.save({ ...dto })`). If
so, an undeclared property such as `role` can be written. Also check whether
another `ValidationPipe` with `whitelist: true` is registered globally – the
rule does not know about pipes configured in other files.

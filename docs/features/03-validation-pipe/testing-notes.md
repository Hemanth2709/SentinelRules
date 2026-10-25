# ValidationPipe: testing notes

Fixture: [`tests/validation-pipe.ts`](../../../tests/validation-pipe.ts)

## Expected findings

| Case | Pattern |
|---|---|
| `bootstrapWithDefaults` | `app.useGlobalPipes(new ValidationPipe())` |
| `bootstrapWithTransformOnly` | options without `whitelist` |
| `UsersController.create` | `@UsePipes(new ValidationPipe({ whitelist: false }))` |
| `ValidationModuleWithDefaults` | `{ provide: APP_PIPE, useClass: ValidationPipe }` |

## Expected non-findings

| Case | Pattern |
|---|---|
| `bootstrapWithWhitelist` | global pipe with `whitelist: true` |
| `AccountsController.create` | parameter pipe `@Body(new ValidationPipe({ transform: true, whitelist: true }))` |
| `ValidationModuleWithWhitelist` | `APP_PIPE` with `useValue` and `whitelist: true` |
| `bootstrapWithSharedOptions` | options variable |
| `bootstrapWithSpreadOptions` | options with a spread |

## Commands

```bash
semgrep --test --config rules/validation-pipe.yml tests/validation-pipe.ts
semgrep --test --config rules/ tests/
```

## Results

| Date | Semgrep | Result |
|---|---|---|
| 2026-10-25 | 1.180.0 | `✓ All tests passed` (4 findings, 5 non-findings) |

## Failures and resolutions

| Date | Problem | Resolution |
|---|---|---|
| 2026-10-25 | Ad-hoc scan showed `new ValidationPipe({ ...shared })` reported although `shared` may set `whitelist`. | Added a spread exclusion and the `bootstrapWithSpreadOptions` fixture. |

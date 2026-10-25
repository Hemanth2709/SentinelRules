# ValidationPipe: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-10-25 | Created `sentinel-nestjs-validation-pipe-missing-whitelist` covering `new ValidationPipe()`, inline options without `whitelist: true`, and `APP_PIPE` with `useClass` | Detect pipes that do not strip undecorated properties | `semgrep --test`, 4 positive / 4 negative | Pass |
| 2026-10-25 | Excluded options objects containing a spread | Ad-hoc scan showed a false positive for shared options | New `bootstrapWithSpreadOptions` negative fixture | Pass |
| 2026-10-25 | Wrote feature documentation and examples | Milestone 2 deliverable | `scripts/check-examples.sh` | Pass |

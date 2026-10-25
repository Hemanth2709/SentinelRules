# CORS: testing notes

Fixture: [`tests/cors-misconfiguration.ts`](../../../tests/cors-misconfiguration.ts)

## Expected findings

| Case | Pattern |
|---|---|
| `bootstrapReflectAll` | `enableCors({ origin: true, credentials: true })` |
| `bootstrapViaFactoryOptions` | `NestFactory.create(..., { cors: { credentials: true, ..., origin: true } })` |
| `app.use(cors({...}))` | callback `callback(null, true)` |
| `manualCorsHeaders` | reflected `req.headers.origin` plus credentials header |

## Expected non-findings

| Case | Pattern |
|---|---|
| `bootstrapAllowlist` | array allowlist with credentials |
| allowlist callback | `callback(null, !origin || allowedOrigins.includes(origin))` |
| public API | `origin: true, credentials: false` |
| `manualAllowlistedHeaders` | validated origin variable |

## Commands

```bash
semgrep --test --config rules/cors-misconfiguration.yml tests/cors-misconfiguration.ts
scripts/run-tests.sh
```

## Results

| Date | Semgrep | Result |
|---|---|---|
| 2026-10-25 | 1.180.0 | `✓ All tests passed` (4 findings, 4 non-findings) |

## Failures and resolutions

| Date | Problem | Resolution |
|---|---|---|
| 2026-10-25 | The callback case was annotated on the `origin:` line, but object-level matches are reported on the line of the opening brace (`cors({`). | Moved the annotation above `cors({`. The rule was correct; the fixture annotation was wrong. |

## Ad-hoc observations (2026-10-25)

Not reported: `origin: /\.example\.com$/` (regex), `origin: '*'` with
credentials, and `cb(null, o.endsWith('example.com'))` (weak suffix check).

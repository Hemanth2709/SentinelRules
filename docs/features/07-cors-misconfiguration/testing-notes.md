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
| 2026-11-04 | 1.180.0 | v0.3.0: `2/2: ✓ All tests passed`; `sentinel-cors-credentials-any-origin` 6 findings, 6 non-findings; new `sentinel-cors-weak-origin-check` 4 findings, 4 non-findings; direct scan 10 findings for 10 `ruleid` lines |

## Failures and resolutions

| Date | Problem | Resolution |
|---|---|---|
| 2026-10-25 | The callback case was annotated on the `origin:` line, but object-level matches are reported on the line of the opening brace (`cors({`). | Moved the annotation above `cors({`. The rule was correct; the fixture annotation was wrong. |
| 2026-11-04 | Fetch API fixtures (`response.headers.set(...)` with `request.headers.get('origin')`) failed against the v0.2.0 rule: lines 86 and 94 not reported. | Added Fetch-API branches (either order) for `headers.set`/`append`. |
| 2026-11-04 | The reversed-order Fetch case is reported on its first statement (`Allow-Credentials`), not on the `Allow-Origin` line where the annotation was first placed. | Moved the annotation above the first statement, as for the existing Express case. |

## Ad-hoc observations (2026-10-25)

Not reported: `origin: /\.example\.com$/` (regex), `origin: '*'` with
credentials, and `cb(null, o.endsWith('example.com'))` (weak suffix check).

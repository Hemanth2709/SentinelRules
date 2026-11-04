# Missing Helmet: testing notes

Fixture: [`tests/missing-helmet.ts`](../../../tests/missing-helmet.ts)

## Expected findings

| Case | Pattern |
|---|---|
| bootstrap | NestJS app, no helmet before listen |
| bootstrapTyped | `NestFactory.create<NestExpressApplication>` |
| startExpress | Express app, no helmet |

## Expected non-findings

| Case | Pattern |
|---|---|
| bootstrapWithHelmet | `app.use(helmet())` |
| bootstrapWithHelmetOptions | `app.use(helmet({...}))` |
| bootstrapFastify | `register(fastifyHelmet)` |
| startExpressWithHelmet | Express with `helmet()` |
| startQueue | `listen()` on a non-HTTP object |

## Commands

```bash
semgrep --test --config rules/missing-helmet.yml tests/missing-helmet.ts
semgrep scan --metrics=off --config rules/missing-helmet.yml tests/missing-helmet.ts   # duplicate check
scripts/run-tests.sh
```

## Results

- 2026-11-04, Semgrep 1.180.0: `1/1: ✓ All tests passed`. `semgrep scan` on the
  fixture reports one finding per `ruleid` line, no duplicates.
- Failures during development are recorded in the
  [implementation log](implementation-log.md).
- Not yet measured on real applications; see
  [benchmark-results.md](../../benchmark-results.md).

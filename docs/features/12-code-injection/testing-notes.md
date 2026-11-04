# Code injection: testing notes

Fixture: [`tests/code-injection.ts`](../../../tests/code-injection.ts)

## Expected findings

| Case | Pattern |
|---|---|
| GET handler | query string into `eval` |
| POST handler | JSON body into `new Function` template |
| Express /run | `req.body.code` into `vm.runInNewContext` |
| Express /delay | string into `setTimeout` |
| RulesController.test | `@Body()` field into `Function(...)` |
| RulesController.script | `@Query()` into `new vm.Script` |

## Expected non-findings

| Case | Pattern |
|---|---|
| constantEval | constant code |
| parseOnly | `JSON.parse` treats input as data |
| dispatch | key into a constant `OPERATIONS` map |
| Express /later | `setTimeout` with an arrow function |

## Commands

```bash
semgrep --test --config rules/code-injection.yml tests/code-injection.ts
semgrep scan --metrics=off --config rules/code-injection.yml tests/code-injection.ts   # duplicate check
scripts/run-tests.sh
```

## Results

- 2026-11-04, Semgrep 1.180.0: `1/1: ✓ All tests passed`. `semgrep scan` on the
  fixture reports one finding per `ruleid` line, no duplicates.
- Failures during development are recorded in the
  [implementation log](implementation-log.md).
- Not yet measured on real applications; see
  [benchmark-results.md](../../benchmark-results.md).

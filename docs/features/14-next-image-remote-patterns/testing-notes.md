# Image remotePatterns: testing notes

Fixture: [`tests/next-image-remote-patterns.ts`](../../../tests/next-image-remote-patterns.ts)

## Expected findings

| Case | Pattern |
|---|---|
| anyHost | `hostname: '**'` |
| singleWildcard | `hostname: '*'` next to a safe entry |
| urlForm | `new URL('https://**/**')` |
| module.exports | double-quoted `"**"` |

## Expected non-findings

| Case | Pattern |
|---|---|
| exactHost | exact host with a path |
| ownSubdomains | `'**.example.com'` |
| urlFormExact | `new URL('https://cdn.example.com/...')` |
| unrelated | `hostname: '**'` outside `remotePatterns` |

## Commands

```bash
semgrep --test --config rules/next-image-remote-patterns.yml tests/next-image-remote-patterns.ts
semgrep scan --metrics=off --config rules/next-image-remote-patterns.yml tests/next-image-remote-patterns.ts   # duplicate check
scripts/run-tests.sh
```

## Results

- 2026-11-04, Semgrep 1.180.0: `1/1: ✓ All tests passed`. `semgrep scan` on the
  fixture reports one finding per `ruleid` line, no duplicates.
- Failures during development are recorded in the
  [implementation log](implementation-log.md).
- Not yet measured on real applications; see
  [benchmark-results.md](../../benchmark-results.md).

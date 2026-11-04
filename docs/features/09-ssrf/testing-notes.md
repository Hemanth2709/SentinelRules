# SSRF: testing notes

Fixture: [`tests/ssrf.ts`](../../../tests/ssrf.ts)

## Expected findings

| Case | Pattern |
|---|---|
| GET handler | `searchParams.get('url')` into `fetch` |
| PUT handler | `nextUrl.searchParams` into `axios.post` |
| POST handler | destructured `await request.json()` into `fetch` |
| PATCH handler | user value at the start of a template literal |
| Server Action | `formData.get('source')` into `fetch` |
| Express | `req.query.url` into `fetch` |
| NestJS | `@Query()` into `this.httpService.get`; `@Body()` field into `axios.get` |

## Expected non-findings

| Case | Pattern |
|---|---|
| constantUrl | constant URL |
| fixedOrigin | fixed `https://host/` with an encoded path segment |
| allowlisted | `if (!isAllowedUrl(target)) return` |
| asserted | `assertAllowedUrl(url)` |
| fromMap | key into a constant `UPSTREAMS` map |
| cacheLookup | `Map.get()` is not an HTTP call |

## Commands

```bash
semgrep --test --config rules/ssrf.yml tests/ssrf.ts
semgrep scan --metrics=off --config rules/ssrf.yml tests/ssrf.ts   # duplicate check
scripts/run-tests.sh
```

## Results

- 2026-11-04, Semgrep 1.180.0: `1/1: ✓ All tests passed`. `semgrep scan` on the
  fixture reports one finding per `ruleid` line, no duplicates.
- Failures during development are recorded in the
  [implementation log](implementation-log.md).
- Not yet measured on real applications; see
  [benchmark-results.md](../../benchmark-results.md).

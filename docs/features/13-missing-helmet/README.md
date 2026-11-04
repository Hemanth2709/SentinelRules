# Rule 13: Missing Helmet

| | |
|---|---|
| Rule ID | `sentinel-missing-helmet` |
| Rule file | [`rules/missing-helmet.yml`](../../../rules/missing-helmet.yml) |
| Test fixture | [`tests/missing-helmet.ts`](../../../tests/missing-helmet.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/missing-helmet.ts) · [secure](../../../examples/secure/missing-helmet.ts) |
| Severity | WARNING |
| Confidence | LOW |
| CWE | CWE-693, CWE-1021 |
| OWASP | A05:2021 Security Misconfiguration |
| Status | Released (v0.3.0) |

## Purpose

Flags a NestJS app (`NestFactory.create`) or an Express app (`express()`) that calls `listen()` without registering `helmet()` earlier in the same function (`app.use(helmet())`, `app.use(helmet)`, or `register(helmet)` / `register(fastifyHelmet)` on the Fastify adapter).

This is a syntactic audit rule: it looks at one bootstrap function at a time.

## Running the tests

```bash
semgrep --test --config rules/missing-helmet.yml tests/missing-helmet.ts
```

## Interpreting a finding

Check whether security headers are set somewhere the rule cannot see: a reverse proxy or CDN (nginx, Cloudflare, Vercel headers), or a setup function in another file. If so, suppress with `nosemgrep` and say where. Otherwise add `app.use(helmet())` before `listen()`.

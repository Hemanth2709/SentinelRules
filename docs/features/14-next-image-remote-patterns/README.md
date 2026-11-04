# Rule 14: Next.js image wildcard host

| | |
|---|---|
| Rule ID | `sentinel-next-image-wildcard-remote-pattern` |
| Rule file | [`rules/next-image-remote-patterns.yml`](../../../rules/next-image-remote-patterns.yml) |
| Test fixture | [`tests/next-image-remote-patterns.ts`](../../../tests/next-image-remote-patterns.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/next-image-remote-patterns.ts) · [secure](../../../examples/secure/next-image-remote-patterns.ts) |
| Severity | WARNING |
| Confidence | HIGH |
| CWE | CWE-918, CWE-400 |
| OWASP | A05:2021 Security Misconfiguration, A10:2021 Server-Side Request Forgery |
| Status | Released (v0.3.0) |

## Purpose

Flags `images.remotePatterns` entries in a Next.js config that allow any host: `hostname: '*'` or `hostname: '**'`, and the URL form `new URL('https://**/...')`.

This is a syntactic rule on `next.config` objects.

## Running the tests

```bash
semgrep --test --config rules/next-image-remote-patterns.yml tests/next-image-remote-patterns.ts
```

## Interpreting a finding

A finding is almost always worth fixing: replace the wildcard with the exact hosts that serve your images, or with your own subdomains (`'**.example.com'`).

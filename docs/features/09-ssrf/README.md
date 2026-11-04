# Rule 09: Server-side request forgery (SSRF)

| | |
|---|---|
| Rule ID | `sentinel-ssrf-user-controlled-url` |
| Rule file | [`rules/ssrf.yml`](../../../rules/ssrf.yml) |
| Test fixture | [`tests/ssrf.ts`](../../../tests/ssrf.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/ssrf.ts) · [secure](../../../examples/secure/ssrf.ts) |
| Severity | WARNING |
| Confidence | MEDIUM |
| CWE | CWE-918 |
| OWASP | A10:2021 Server-Side Request Forgery |
| Status | Released (v0.2.0) |

## Purpose

Flags outbound HTTP requests whose URL comes from the incoming request: `fetch`, `axios`, `got`, Node `http`/`https`, and NestJS `HttpService` (`this.httpService.get(url)`, `this.http.axiosRef.get(url)`).

This is a taint-mode rule: it follows a value from the request to the
dangerous call within one file ([DEC-010](../../decisions/decision-log.md)).

## Running the tests

```bash
semgrep --test --config rules/ssrf.yml tests/ssrf.ts
```

## Interpreting a finding

Check where the URL can point. If the caller can choose the host, the server can be sent to `169.254.169.254` (cloud metadata), `localhost` services or internal hostnames. If an allowlist check exists in another function or file, the finding is a false positive: record it with `nosemgrep` and the reason.

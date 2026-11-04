# Feature documentation

Each rule has its own folder with the same seven documents:

| File | Contents |
|---|---|
| `README.md` | Purpose, files, how to run tests, how to read a finding |
| `vulnerability-explanation.md` | The weakness, attack, preconditions |
| `detection-logic.md` | Semgrep patterns and why they were chosen |
| `remediation.md` | Vulnerable vs corrected code |
| `testing-notes.md` | Fixtures, commands, recorded results, failures |
| `limitations.md` | False positives, false negatives, manual review |
| `implementation-log.md` | Dated development history |

| # | Feature | Rule IDs | Status |
|---|---|---|---|
| 01 | [SQL injection](01-sql-injection/README.md) | `sentinel-sql-injection-raw-query`, `sentinel-sql-injection-tainted-query` | Released (v0.1.0); tainted rule and helper coverage released in v0.3.0 |
| 02 | [JWT misconfiguration](02-jwt-misconfiguration/README.md) | `sentinel-jwt-ignore-expiration`, `sentinel-jwt-verify-missing-algorithms`, `sentinel-jwt-decode-without-verify` | Released (v0.1.0); decode rule released in v0.3.0 |
| 03 | [ValidationPipe](03-validation-pipe/README.md) | `sentinel-nestjs-validation-pipe-missing-whitelist` | Released (v0.1.0) |
| 04 | [Public secrets](04-next-public-secrets/README.md) | `sentinel-next-public-secret-env` | Released (v0.1.0); destructuring and provider keys released in v0.3.0 |
| 05 | [Unsafe HTML](05-unsafe-html/README.md) | `sentinel-react-dangerously-set-inner-html`, `sentinel-dom-html-sink-user-input` | Released (v0.1.0); DOM/HTML taint rule released in v0.3.0 |
| 06 | [Insecure cookies](06-insecure-cookies/README.md) | `sentinel-insecure-session-cookie` | Released (v0.1.0); options from constants released in v0.3.0 |
| 07 | [CORS misconfiguration](07-cors-misconfiguration/README.md) | `sentinel-cors-credentials-any-origin`, `sentinel-cors-weak-origin-check` | Released (v0.1.0); Fetch API headers and weak-check rule released in v0.3.0 |
| 08 | [Missing authorization](08-missing-authorization/README.md) | `sentinel-nestjs-route-missing-guard`, `sentinel-nextjs-handler-missing-auth-check` | Released (v0.1.0) |
| 09 | [SSRF](09-ssrf/README.md) | `sentinel-ssrf-user-controlled-url` | Released (v0.2.0) |
| 10 | [Open redirect](10-open-redirect/README.md) | `sentinel-open-redirect-user-controlled-url` | Released (v0.2.0) |
| 11 | [Mass assignment](11-mass-assignment/README.md) | `sentinel-mass-assignment-unfiltered-body` | Released (v0.2.0) |
| 12 | [Code injection](12-code-injection/README.md) | `sentinel-code-injection-eval-user-input` | Released (v0.2.0) |
| 13 | [Missing Helmet](13-missing-helmet/README.md) | `sentinel-missing-helmet` | Released (v0.3.0) |
| 14 | [Image remotePatterns](14-next-image-remote-patterns/README.md) | `sentinel-next-image-wildcard-remote-pattern` | Released (v0.3.0) |

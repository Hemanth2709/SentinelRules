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
| 01 | [SQL injection](01-sql-injection/README.md) | `sentinel-sql-injection-raw-query` | Tested |
| 02 | [JWT misconfiguration](02-jwt-misconfiguration/README.md) | `sentinel-jwt-ignore-expiration`, `sentinel-jwt-verify-missing-algorithms` | Tested |
| 03 | [ValidationPipe](03-validation-pipe/README.md) | `sentinel-nestjs-validation-pipe-missing-whitelist` | Tested |
| 04 | [Public secrets](04-next-public-secrets/README.md) | `sentinel-next-public-secret-env` | Tested |
| 05 | [Unsafe HTML](05-unsafe-html/README.md) | `sentinel-react-dangerously-set-inner-html` | Tested |
| 06 | [Insecure cookies](06-insecure-cookies/README.md) | `sentinel-insecure-session-cookie` | Tested |
| 07 | [CORS misconfiguration](07-cors-misconfiguration/README.md) | `sentinel-cors-credentials-any-origin` | Tested |
| 08 | [Missing authorization](08-missing-authorization/README.md) | `sentinel-nestjs-route-missing-guard`, `sentinel-nextjs-handler-missing-auth-check` | Tested |

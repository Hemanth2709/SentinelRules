# Security mappings

OWASP categories refer to the OWASP Top 10 **2021**.

| Rule ID | CWE | OWASP | Rationale |
|---|---|---|---|
| `sentinel-sql-injection-raw-query` | CWE-89 | A03 Injection | Dynamic SQL text is the definition of SQL injection |
| `sentinel-jwt-ignore-expiration` | CWE-613 | A07 Identification and Authentication Failures | Tokens never expire: insufficient session expiration |
| `sentinel-jwt-verify-missing-algorithms` | CWE-347 | A02 Cryptographic Failures, A07 | Signature verification may use an attacker-chosen algorithm |
| `sentinel-nestjs-validation-pipe-missing-whitelist` | CWE-915 | A08 Software and Data Integrity Failures, A04 Insecure Design | Undeclared properties reach object updates (mass assignment). OWASP's Top 10 2021 mapping lists CWE-915 under A08 |
| `sentinel-next-public-secret-env` | CWE-200, CWE-522 | A01 Broken Access Control, A05 Security Misconfiguration | Credential exposed to all clients; CWE-200 is mapped to A01 in the 2021 list |
| `sentinel-react-dangerously-set-inner-html` | CWE-79 | A03 Injection | XSS is part of A03 in 2021 |
| `sentinel-insecure-session-cookie` | CWE-1004, CWE-614, CWE-1275 | A05 Security Misconfiguration, A07 | Missing HttpOnly / Secure / SameSite attributes on session cookies |
| `sentinel-cors-credentials-any-origin` | CWE-942, CWE-346 | A05 Security Misconfiguration, A01 Broken Access Control | Permissive credentialed cross-origin policy |
| `sentinel-nestjs-route-missing-guard` | CWE-862 | A01 Broken Access Control | Candidate missing authorization |
| `sentinel-nextjs-handler-missing-auth-check` | CWE-862, CWE-306 | A01 Broken Access Control, A07 | Candidate missing authorization (CWE-862, A01) or authentication (CWE-306, A07) |

## Where each CWE sits in the OWASP Top 10 2021 CWE lists

| CWE | 2021 category |
|---|---|
| CWE-79, CWE-89 | A03 Injection |
| CWE-200, CWE-862, CWE-1275 | A01 Broken Access Control |
| CWE-347 | A02 Cryptographic Failures |
| CWE-522 | A04 Insecure Design |
| CWE-614, CWE-942, CWE-1004 | A05 Security Misconfiguration |
| CWE-306, CWE-346, CWE-613 | A07 Identification and Authentication Failures |
| CWE-915 | A08 Software and Data Integrity Failures |

Some rules list an OWASP category that differs from the official list for
one of their CWEs, because the category describes the configuration problem
better (for example, the `NEXT_PUBLIC_` rule uses A05 for the misconfiguration
and A01 for CWE-200). The table above makes the official placement visible.

## Review notes

- Mappings were reviewed against the CWE definitions while writing each rule
  (2026-10-25). They have not been independently reviewed by a second person.
- Where a rule detects a *suspicious configuration* rather than a confirmed
  weakness (JWT algorithms, missing authorization), the CWE describes the
  weakness the finding may indicate.

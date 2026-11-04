# Security mappings

OWASP categories refer to the OWASP Top 10 **2021**.

| Rule ID | CWE | OWASP | Rationale |
|---|---|---|---|
| `sentinel-sql-injection-raw-query` | CWE-89 | A03 Injection | Dynamic SQL text is the definition of SQL injection |
| `sentinel-sql-injection-tainted-query` | CWE-89 | A03 Injection | Request data reaches SQL text (taint mode) |
| `sentinel-jwt-ignore-expiration` | CWE-613 | A07 Identification and Authentication Failures | Tokens never expire: insufficient session expiration |
| `sentinel-jwt-verify-missing-algorithms` | CWE-347 | A02 Cryptographic Failures, A07 | Signature verification may use an attacker-chosen algorithm |
| `sentinel-jwt-decode-without-verify` | CWE-347, CWE-345 | A07, A02 Cryptographic Failures, A08 Software and Data Integrity Failures | Claims are trusted with no signature check (CWE-347, A02); more generally, unauthenticated data is trusted (CWE-345, which the 2021 list places under A08); the usual impact is broken authentication (A07) |
| `sentinel-nestjs-validation-pipe-missing-whitelist` | CWE-915 | A08 Software and Data Integrity Failures, A04 Insecure Design | Undeclared properties reach object updates (mass assignment). OWASP's Top 10 2021 mapping lists CWE-915 under A08 |
| `sentinel-next-public-secret-env` | CWE-200, CWE-522 | A01 Broken Access Control, A05 Security Misconfiguration | Credential exposed to all clients; CWE-200 is mapped to A01 in the 2021 list |
| `sentinel-react-dangerously-set-inner-html` | CWE-79 | A03 Injection | XSS is part of A03 in 2021 |
| `sentinel-dom-html-sink-user-input` | CWE-79 | A03 Injection | URL or request data parsed as HTML (DOM-based or reflected XSS) |
| `sentinel-insecure-session-cookie` | CWE-1004, CWE-614, CWE-1275 | A05 Security Misconfiguration, A07 | Missing HttpOnly / Secure / SameSite attributes on session cookies |
| `sentinel-cors-credentials-any-origin` | CWE-942, CWE-346 | A05 Security Misconfiguration, A01 Broken Access Control | Permissive credentialed cross-origin policy |
| `sentinel-cors-weak-origin-check` | CWE-346, CWE-942 | A05 Security Misconfiguration, A01 Broken Access Control | The origin check itself is flawed (CWE-346), so the cross-origin policy trusts attacker domains (CWE-942); same categories as the rule above |
| `sentinel-nestjs-route-missing-guard` | CWE-862 | A01 Broken Access Control | Candidate missing authorization |
| `sentinel-nextjs-handler-missing-auth-check` | CWE-862, CWE-306 | A01 Broken Access Control, A07 | Candidate missing authorization (CWE-862, A01) or authentication (CWE-306, A07) |
| `sentinel-ssrf-user-controlled-url` | CWE-918 | A10 Server-Side Request Forgery | The server requests a URL the client chose |
| `sentinel-open-redirect-user-controlled-url` | CWE-601 | A01 Broken Access Control | Redirect to an untrusted site; CWE-601 is listed under A01 in 2021 |
| `sentinel-mass-assignment-unfiltered-body` | CWE-915 | A08 Software and Data Integrity Failures, A01 Broken Access Control | Client sets object attributes it should not control; A01 because the usual impact is privilege escalation (OWASP API3:2023, broken object property level authorization) |
| `sentinel-code-injection-eval-user-input` | CWE-95, CWE-94 | A03 Injection | Request data evaluated as code |
| `sentinel-missing-helmet` | CWE-693, CWE-1021 | A05 Security Misconfiguration | A protection mechanism (security headers) is not applied; CWE-1021 for the missing frame protection |
| `sentinel-next-image-wildcard-remote-pattern` | CWE-918, CWE-400 | A05 Security Misconfiguration, A10 Server-Side Request Forgery | The image optimizer fetches from any host: a configuration problem (A05) whose effect is server-side requests (CWE-918, A10) and resource use (CWE-400) |

## Where each CWE sits in the OWASP Top 10 2021 CWE lists

| CWE | 2021 category |
|---|---|
| CWE-79, CWE-89, CWE-94, CWE-95 | A03 Injection |
| CWE-200, CWE-601, CWE-862, CWE-1275 | A01 Broken Access Control |
| CWE-347 | A02 Cryptographic Failures |
| CWE-522 | A04 Insecure Design |
| CWE-614, CWE-942, CWE-1004 | A05 Security Misconfiguration |
| CWE-693, CWE-1021, CWE-400 | Not in a 2021 Top 10 CWE list; A05 used for the misconfiguration |
| CWE-306, CWE-346, CWE-613 | A07 Identification and Authentication Failures |
| CWE-345, CWE-915 | A08 Software and Data Integrity Failures |
| CWE-918 | A10 Server-Side Request Forgery |

Some rules list an OWASP category that differs from the official list for
one of their CWEs, because the category describes the configuration problem
better (for example, the `NEXT_PUBLIC_` rule uses A05 for the misconfiguration
and A01 for CWE-200). The table above makes the official placement visible.

## Review notes

- Mappings were reviewed against the CWE definitions while writing each rule
  (2026-10-25; rules 09–14 and the v0.3.0 rule IDs on 2026-11-04). They have not been independently reviewed by a second person.
- Where a rule detects a *suspicious configuration* rather than a confirmed
  weakness (JWT algorithms, missing authorization), the CWE describes the
  weakness the finding may indicate.

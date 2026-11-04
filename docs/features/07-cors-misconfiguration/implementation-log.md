# CORS: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-10-25 | Created `sentinel-cors-credentials-any-origin` for `origin: true`, allow-all and echo callbacks, and manual reflected headers, each combined with credentials | Detect credentialed CORS that trusts any origin | `semgrep --test`, 4 positive / 4 negative | Initial run failed (annotation on wrong line) |
| 2026-10-25 | Corrected fixture annotation position | Object matches are reported at the opening brace | Re-ran `semgrep --test` | Pass |
| 2026-10-25 | Wrote feature documentation and examples | Milestone 3 deliverable | `scripts/check-examples.sh` | Pass |
| 2026-11-04 | Web Fetch API headers (`headers.set`/`append`) reflecting `request.headers.get('origin')` together with `Allow-Credentials: true` | Documented false negative; benchmark V-10 | Fixtures failed first, then pass; V-10 detected | Pass |
| 2026-11-04 | Added `sentinel-cors-weak-origin-check`: `endsWith`/`includes` without a leading dot, host-only `startsWith`, regexes not anchored at both ends, on values named `origin` | Documented false negative; benchmark V-11 | Stub failed first; `semgrep --test` pass; V-11 detected, S-29 (leading dot) clean | Pass |

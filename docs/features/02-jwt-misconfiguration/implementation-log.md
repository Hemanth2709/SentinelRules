# JWT misconfiguration: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-10-25 | Created `sentinel-jwt-ignore-expiration` (object literal with `ignoreExpiration: true`) | Detect disabled expiration checks across jsonwebtoken, passport-jwt and @nestjs/jwt | `semgrep --test`, 2 positive / 2 negative | Initial run failed: finding on wrong line |
| 2026-10-25 | Focused the finding on the `true` value | Report should point at the offending property | Re-ran `semgrep --test` | Pass |
| 2026-10-25 | Created `sentinel-jwt-verify-missing-algorithms`, scoped to `jsonwebtoken` imports and `require` | Flag verification without an algorithm allowlist, without matching unrelated `.verify()` methods | 4 positive / 4 negative | Pass |
| 2026-10-25 | Excluded options objects containing a spread | Ad-hoc scan showed a false positive when `algorithms` came from a spread | New `verifyWithSpreadOptions` negative fixture | Pass |
| 2026-10-25 | Wrote feature documentation and examples | Milestone 2 deliverable | `scripts/check-examples.sh` | Pass |
| 2026-11-04 | Added `sentinel-jwt-decode-without-verify` (WARNING, audit): `jsonwebtoken` `decode()` in a function, method or arrow function that never calls `verify()`/`verifyAsync()` | Documented false negative; benchmark V-06 | Stub failed first; `semgrep --test` pass; benchmark V-06 detected, S-27 (decode then verify) clean | Pass |
| 2026-11-04 | v0.3.0 changes released (tag on `b946320`) | Milestone 6 | Rule patterns identical to the benchmarked commit `7fe1eef`; `sentinel-jwt-decode-without-verify` gained the A08 OWASP tag in `8ff2f3b` (metadata only) | Released |

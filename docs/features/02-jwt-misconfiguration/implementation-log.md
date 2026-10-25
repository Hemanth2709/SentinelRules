# JWT misconfiguration: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-10-25 | Created `sentinel-jwt-ignore-expiration` (object literal with `ignoreExpiration: true`) | Detect disabled expiration checks across jsonwebtoken, passport-jwt and @nestjs/jwt | `semgrep --test`, 2 positive / 2 negative | Initial run failed: finding on wrong line |
| 2026-10-25 | Focused the finding on the `true` value | Report should point at the offending property | Re-ran `semgrep --test` | Pass |
| 2026-10-25 | Created `sentinel-jwt-verify-missing-algorithms`, scoped to `jsonwebtoken` imports and `require` | Flag verification without an algorithm allowlist, without matching unrelated `.verify()` methods | 4 positive / 4 negative | Pass |
| 2026-10-25 | Excluded options objects containing a spread | Ad-hoc scan showed a false positive when `algorithms` came from a spread | New `verifyWithSpreadOptions` negative fixture | Pass |
| 2026-10-25 | Wrote feature documentation and examples | Milestone 2 deliverable | `scripts/check-examples.sh` | Pass |

# Public secrets: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-10-25 | Created `sentinel-next-public-secret-env` for dot access, bracket access, and `next.config.js` `env` keys | Detect credentials exposed through the public prefix | `semgrep --test`, 4 positive / 5 negative | Pass |
| 2026-10-25 | Restricted indicators to unambiguous secret words; added exclusion for `PUBLISHABLE`, `PUBLIC_KEY`, `ANON_KEY` | Avoid reporting provider keys that are public by design | Negative fixtures for Stripe publishable and Supabase anon keys | Pass |
| 2026-10-25 | Recorded ad-hoc false-positive / false-negative probes | Document limitations from observed behaviour | Ad-hoc scan | Recorded in limitations.md |
| 2026-10-25 | Wrote feature documentation and examples | Milestone 2 deliverable | `scripts/check-examples.sh` | Pass |

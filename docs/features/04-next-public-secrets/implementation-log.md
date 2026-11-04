# Public secrets: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-10-25 | Created `sentinel-next-public-secret-env` for dot access, bracket access, and `next.config.js` `env` keys | Detect credentials exposed through the public prefix | `semgrep --test`, 4 positive / 5 negative | Pass |
| 2026-10-25 | Restricted indicators to unambiguous secret words; added exclusion for `PUBLISHABLE`, `PUBLIC_KEY`, `ANON_KEY` | Avoid reporting provider keys that are public by design | Negative fixtures for Stripe publishable and Supabase anon keys | Pass |
| 2026-10-25 | Recorded ad-hoc false-positive / false-negative probes | Document limitations from observed behaviour | Ad-hoc scan | Recorded in limitations.md |
| 2026-10-25 | Wrote feature documentation and examples | Milestone 2 deliverable | `scripts/check-examples.sh` | Pass |
| 2026-11-04 | Destructuring from `process.env` (`const { NEXT_PUBLIC_X }`, `{ NEXT_PUBLIC_X: alias }`); keys and tokens of providers that issue no browser-safe keys (OpenAI, Anthropic, Groq, Mistral, Cohere, Replicate, Hugging Face, DeepSeek, SendGrid, Resend, Mailgun, Postmark, Twilio; GitHub, GitLab, npm, Slack, Discord tokens) | Documented false negatives; benchmark V-16 and V-17 | Fixtures failed first, then pass; benchmark V-16, V-17 detected, S-19 clean | Pass |
| 2026-11-04 | v0.3.0 changes released (tag on `b946320`) | Milestone 6 | Rule patterns identical to the benchmarked commit `7fe1eef` | Released |

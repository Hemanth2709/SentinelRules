# Unsafe HTML: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-10-25 | Created `sentinel-react-dangerously-set-inner-html` matching `{__html: $HTML}` with literal and sanitizer exclusions | Detect dynamic raw-HTML rendering in React/Next.js | `semgrep --test`, 3 positive / 4 negative | Initial run failed (fixture annotation issue) |
| 2026-10-25 | Rewrote the `SearchPage` fixture to use a `//` annotation | Semgrep's test runner does not read annotations in JSX `{/* */}` comments | Re-ran `semgrep --test` | Pass |
| 2026-10-25 | Wrote feature documentation and examples | Milestone 2 deliverable | `scripts/check-examples.sh` | Pass |

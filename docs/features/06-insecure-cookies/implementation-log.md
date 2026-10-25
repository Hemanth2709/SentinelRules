# Insecure cookies: implementation log

| Date | Change | Reason | Validation | Outcome |
|---|---|---|---|---|
| 2026-10-25 | Drafted two rules (missing attributes; `secure: false`) | Initial approach | Not run | Replaced before testing: two findings for one call would be noise |
| 2026-10-25 | Merged into `sentinel-insecure-session-cookie` with a nested `pattern-either` | One finding per cookie call; first merge attempt failed validation ("cannot negate in an Or") and was restructured | `semgrep --validate`, `semgrep --test`, 5 positive / 4 negative | Pass |
| 2026-10-25 | Restricted to session-like literal cookie names and to `cookies()` / `.cookies` receivers for `.set()` | Distinguish session cookies from other cookies; avoid `Map.set` | `setPreferences`, `cacheSet` negative fixtures | Pass |
| 2026-10-25 | Fixed doubled quotes in message | Cosmetic | Direct scan | Fixed |
| 2026-10-25 | Wrote feature documentation and examples | Milestone 3 deliverable | `scripts/check-examples.sh` | Pass |

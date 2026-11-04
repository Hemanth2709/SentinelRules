# SSRF: limitations

All limitations of single-file analysis apply (no cross-file dataflow).

## False negatives

- URLs built in another function or file (single-file analysis).
- HTTP clients other than those listed (`undici.request`, `ky`, `superagent`,
  custom wrappers).
- Request data that reaches the code through a variable the rule does not
  treat as a source (for example a value read from a database that a user
  wrote earlier).

## False positives

- An allowlist check whose function name does not match the sanitizer
  pattern, or that lives in middleware.
- Sanitizers are trusted by name: a function called `isAllowedUrl` that does
  not really check the host still silences the finding.

## Manual review

Confirm that the check compares the parsed `hostname` exactly (not
`startsWith` or `includes`), restricts the protocol, and that redirects cannot
lead elsewhere.

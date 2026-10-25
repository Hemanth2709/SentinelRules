# Lessons learned

Recorded during implementation of rules 01–08 and the first benchmark scan on
2026-10-25.

## From the first benchmark (IdentityProvider)

- **All 8 findings were false positives**, and all came from the heuristic
  authorization rules. Fixtures written from the rule author's imagination
  missed a real-world shape: an SDK file with `'use server'` that exports
  *factories* returning actions.
- **A framework rule fixed it.** Next.js only allows async exports in a
  `'use server'` module, so requiring `export async function` removed 7 of 8
  false positives without losing any true case.
- **A regression test must reproduce the failure first.** The first fixture
  for this bug passed even without the fix, because the inner function used a
  recognised helper. Only a fixture that failed before the change proved
  anything.
- **The global-guard limitation is real.** The one remaining finding is a
  route protected by `APP_GUARD` in another file, exactly as documented.

## Harder to detect than expected

- **Missing authorization.** Everything that matters – global guards,
  middleware, wrappers – usually lives outside the file. The rule can only
  produce review candidates. Restricting Next.js to mutating handlers was a
  deliberate noise trade-off.
- **SQL in generic method names.** `query`, `raw`, and `execute` are used by
  many non-SQL libraries. Without type information, the reliable signal was
  the *content* of the string (SQL keywords).

## Why false positives occurred

- **Spread options.** `{ ...shared, audience }` was reported for missing
  `algorithms` and `{ ...shared }` for missing `whitelist`, even though the
  spread could supply them. Found by an ad-hoc probe, fixed with a spread
  exclusion and new negative fixtures.
- **Cross-rule hits on examples.** Login routes in the cookie examples are
  flagged by the authorization rule. They are genuinely unauthenticated by
  design – this is exactly the false-positive class the rule warns about.

## Changes that improved the rules

- `focus-metavariable` to report the exact property (`ignoreExpiration`)
  rather than the start of a multi-line object.
- Restricting cookie `.set()` to `cookies()` / `.cookies` receivers so that
  `Map.set('token', …)` is not reported.

## Assumptions that proved incorrect

- *"`semgrep --test rules/` will run the tests."* With fixtures in `tests/`
  it ran none and exited 0. A test command that can pass vacuously needs a
  guard.
- *"A passing `--test` means the output is right."* `--test` compares lines,
  so a message containing `$1` produced three identical findings per line
  without failing any test. Scanning fixtures directly is a useful second
  check.
- *"`pattern-not: function $F(...)` excludes exported functions."* It does
  not; negations must use the same syntactic form as the positive pattern.
- *"Annotations work anywhere."* JSX `{/* ruleid: */}` comments are not read.
- *"Scanning `tests/` shows fixture findings."* Semgrep's default ignores
  skip `tests/` in scan mode; files must be passed explicitly.

## What could not be reliably detected

- Whether HTML is sanitized correctly, or whether a secret-looking variable
  holds a real secret.
- Weak CORS origin checks (`endsWith`), JWT options built elsewhere,
  cookie options from helpers.

## Future improvements

- Taint-mode versions of the SQL and HTML rules (request source → sink).
- A project-level option to declare that global guards are in use.
- `.env` file scanning with a generic-language rule.
- Arrow-function route handlers and Pages Router API routes.

# Insecure cookies: limitations

## Known false positives

- Cookies whose name contains a session word but that are intentionally
  readable by JavaScript (e.g. a non-sensitive `csrf_token` used with the
  double-submit pattern needs to be readable – suppress with a comment).
- Session cookies set over HTTP only in local development, if the code
  hard-codes `secure: false` instead of making it conditional.
- Frameworks that apply cookie defaults globally (e.g. a cookie-parser
  wrapper) are not visible to the rule.

## Known false negatives

- Options passed as a variable or from a shared helper.
- Cookie names in constants or variables.
- Next.js object form `cookies().set({ name, value, ... })`.
- `express-session`, `cookie-session`, `iron-session`, NextAuth cookie
  configuration.
- Manual `Set-Cookie` headers.
- `sameSite: 'none'` without CSRF protection is accepted.

## Context-dependent requirements

Whether `SameSite=Lax`, `Strict`, or `None` is correct depends on whether the
front end and API are same-site. Whether `Secure` can be unconditional
depends on the local development setup. The rule only checks that a decision
was made.

## What the rule cannot establish

Whether a cookie actually carries a credential, and whether wrapper code
adds attributes later.

# Open redirect: limitations

All limitations of single-file analysis apply (no cross-file dataflow).

## False negatives

- Destinations built in another function or file.
- Redirects through other APIs (`location.href` assignments in client
  components, `Location` headers set by hand, `router.push`).
- Redirect targets stored first (in a cookie or the session) and used on a
  later request.

## False positives

- Validation whose function name does not match the sanitizer patterns, or
  that happens in middleware.
- Sanitizers are trusted by name.

## Manual review

Check that the validation rejects `//`, `/\`, `javascript:` and absolute
URLs, and that it runs on the decoded value.

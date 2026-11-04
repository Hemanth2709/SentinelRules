# Mass assignment: limitations

All limitations of single-file analysis apply (no cross-file dataflow).

## False negatives

- Objects that reach the write through another function or file without a
  `Record<...>` type.
- Rest destructuring: `const { role, ...rest } = body; data: rest` is **not**
  reported (verified with Semgrep 1.180.0). Removing named keys is a
  denylist, and `rest` still carries every other key the client sent.
- ORM methods not listed above.

## False positives

- A `Record<...>` parameter that the caller already filtered.
- Models with no sensitive fields at all.
- A DTO without `whitelist: true` is **not** reported here; Rule 03 reports
  the missing setting instead.

## Manual review

List the model's columns and confirm none of them is security-relevant, or
that the input is reduced to an allowlist before the write.

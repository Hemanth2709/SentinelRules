# ValidationPipe: limitations

## Known false positives

- A route-level pipe without `whitelist` when a global pipe with
  `whitelist: true` also runs (global pipes run first and already strip
  properties). The rule does not correlate pipes across files.
- `whitelist: isProduction` or similar conditional values are reported
  because the value is not literally `true` (confirmed in an ad-hoc scan on
  2026-10-25). This is intentional: it is worth reviewing.
- Endpoints whose handlers never write the body to storage.

## Known false negatives

- Options passed as a variable or via spread (excluded by design).
- Custom pipes, `ValidationPipe` subclasses, `useFactory` providers.
- Applications that do not use `ValidationPipe` at all (no pipe = no
  validation; not detected by this rule).
- Mass assignment through decorated but sensitive DTO fields.

## Framework-specific limitations

Global configuration may be in `main.ts`, in an `AppModule` provider, or in a
shared library. This rule only sees what is written at the construction site.

## What the rule cannot establish

Whether any handler behind the pipe actually performs mass assignment.

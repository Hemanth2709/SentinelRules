# Unsafe HTML: limitations

## Known false positives

- HTML produced entirely by trusted code (e.g. a syntax highlighter run at
  build time on repository files).
- Values sanitized in another function or module before being passed in.
- Sanitizers not in the recognised list (e.g. `xss()`, `purify()` wrappers).

## Known false negatives

- Whole object passed as a variable: `dangerouslySetInnerHTML={props.html}`
  (confirmed in an ad-hoc scan on 2026-10-25).
- DOM sinks outside React (`innerHTML`, `insertAdjacentHTML`).
- HTML parsers that render to React elements (`html-react-parser`).
- Calls named `sanitize` that do not actually sanitize, or DOMPurify with an
  unsafe configuration (e.g. allowing `<script>` or `on*` attributes).

## Patterns requiring manual review

All findings: provenance of the HTML must be traced by a reviewer.

## What the rule cannot establish

Whether the HTML is attacker-controlled, or whether a sanitizer's
configuration is adequate.

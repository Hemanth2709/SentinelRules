# Unsafe HTML: detection logic

Rule: [`rules/unsafe-html.yml`](../../../rules/unsafe-html.yml)

## Matching

1. `pattern: "{__html: $HTML}"` – matches the object both in JSX
   (`dangerouslySetInnerHTML={{ __html: x }}`) and in
   `React.createElement(..., { dangerouslySetInnerHTML: { __html: x } })`.
2. Exclusions:
   - String literal values (`'...'`).
   - Template literals with no interpolation (`metavariable-pattern` with
     `pattern-not: "`...`"`).
   - Inline sanitizer calls: `DOMPurify.sanitize(...)`, `$X.sanitize(...)`,
     `sanitizeHtml(...)`, `sanitize(...)`.
   - A variable assigned from one of those sanitizers earlier in the same
     scope (`pattern-not-inside: $HTML = $PURIFY.sanitize(...); ...`).
3. `focus-metavariable: $HTML` – the finding points at the value.

## Why these patterns

Matching the `__html` key is simpler and more complete than matching the JSX
attribute: the key is only used for this API, and it also catches
`createElement` calls.

## Safe patterns that should not match

- `{ __html: '&copy; 2026' }`
- `{ __html: DOMPurify.sanitize(html) }`
- `const clean = sanitizeHtml(html, opts); ... { __html: clean }`

## Why the detector may miss cases

- `dangerouslySetInnerHTML={props.html}` (the whole object passed through a
  variable) is not matched.
- Other raw-HTML sinks: `element.innerHTML = ...`, `insertAdjacentHTML`,
  `html-react-parser`, `document.write`.
- The rule trusts any call named `sanitize` and does not check sanitizer
  configuration.

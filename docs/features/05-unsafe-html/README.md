# Rule 05: Unsafe `dangerouslySetInnerHTML`

| | |
|---|---|
| Rule ID | `sentinel-react-dangerously-set-inner-html` |
| Rule file | [`rules/unsafe-html.yml`](../../../rules/unsafe-html.yml) |
| Test fixture | [`tests/unsafe-html.tsx`](../../../tests/unsafe-html.tsx) |
| Examples | [vulnerable](../../../examples/vulnerable/unsafe-html.tsx) · [secure](../../../examples/secure/unsafe-html.tsx) |
| Severity | WARNING |
| Confidence | LOW |
| CWE | CWE-79 |
| OWASP | A03:2021 Injection |
| Status | Tested |

## Purpose

Flags `{ __html: value }` objects – used with `dangerouslySetInnerHTML` in JSX
or `React.createElement` – whose value is dynamic and not wrapped in a
recognised sanitizer.

## Running the tests

```bash
semgrep --test --config rules/unsafe-html.yml tests/unsafe-html.tsx
```

## Interpreting a finding

The rule cannot see where the HTML comes from. Trace the value: if it is
built from user input, CMS content editable by many people, a third-party
API, or Markdown written by users, it needs sanitization. If it is produced
entirely by your own code from trusted constants, document that and suppress.

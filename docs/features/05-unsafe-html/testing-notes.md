# Unsafe HTML: testing notes

Fixture: [`tests/unsafe-html.tsx`](../../../tests/unsafe-html.tsx)

## Expected findings

| Case | Pattern |
|---|---|
| `PostBody` | `__html: post.bodyHtml` |
| `SearchPage` | template literal with `${searchParams.q}` |
| `CreateElementBanner` | `React.createElement(..., { dangerouslySetInnerHTML: { __html: html } })` |
| `JsonLdUnescaped` | `JSON.stringify(data)` in a JSON-LD script |
| `JsonLdFirstOnlyEscape` | `JSON.stringify(data).replace('<', ...)` – first `<` only |

## Expected non-findings

| Case | Pattern |
|---|---|
| `StaticNotice` | string literal |
| `SanitizedInline` | `DOMPurify.sanitize(...)` inline |
| `SanitizedVariable` | `sanitizeHtml(...)` assigned to a variable first |
| `PlainJsxText` | `<h1>{post.title}</h1>` |
| `JsonLdEscaped` | `JSON.stringify(data).replace(/</g, '\\u003c')` |

## Commands

```bash
semgrep --test --config rules/unsafe-html.yml tests/unsafe-html.tsx
scripts/run-tests.sh
```

## Results

| Date | Semgrep | Result |
|---|---|---|
| 2026-10-25 | 1.180.0 | `✓ All tests passed` (3 findings, 4 non-findings) |
| 2026-11-02 | 1.180.0 | `✓ All tests passed` (5 findings, 5 non-findings) after the JSON-LD change |
| 2026-11-04 | 1.180.0 | v0.3.0: React rule unchanged (5 findings, 5 non-findings). New taint rule `sentinel-dom-html-sink-user-input` (`tests/unsafe-html-tainted.tsx`): 7 findings, 6 non-findings; no line reported by both rules |

## Failures and resolutions

| Date | Problem | Resolution |
|---|---|---|
| 2026-11-02 | Portfolio benchmark (run 3): the recommended escaped JSON-LD form would also have been reported. | Added `JsonLdEscaped` fixture, confirmed it failed (`incorrect lines: [72]`), then excluded `JSON.stringify(...).replace(/</g, ...)`. |
| 2026-10-25 | The `SearchPage` annotation was written as a JSX comment (`{/* ruleid: ... */}`). Semgrep's test runner did not read it, so the finding on the next line was reported as unexpected. | Moved the element into a `const` with a normal `// ruleid:` comment above it. |
| 2026-11-04 | New taint rule, first run: `res.type('html').send(html)` and `new Response(html, { headers: { 'Content-Type': 'text/html' } })` were missed. Each sink pattern matched on its own; the cause was `metavariable-regex`, which Semgrep anchors at the start of the value, while string values keep their quotes (`'html'`). | Prefixed those regexes with `.*`. |

## Ad-hoc observations (2026-10-25)

- `__html: marked(md)` – reported (expected, Markdown output is HTML).
- `__html: DOMPurify.sanitize(a) + b` – reported (expected, unsanitized
  concatenation).
- `dangerouslySetInnerHTML={props.html}` – not reported (false negative).

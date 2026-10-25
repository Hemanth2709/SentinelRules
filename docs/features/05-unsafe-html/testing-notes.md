# Unsafe HTML: testing notes

Fixture: [`tests/unsafe-html.tsx`](../../../tests/unsafe-html.tsx)

## Expected findings

| Case | Pattern |
|---|---|
| `PostBody` | `__html: post.bodyHtml` |
| `SearchPage` | template literal with `${searchParams.q}` |
| `CreateElementBanner` | `React.createElement(..., { dangerouslySetInnerHTML: { __html: html } })` |

## Expected non-findings

| Case | Pattern |
|---|---|
| `StaticNotice` | string literal |
| `SanitizedInline` | `DOMPurify.sanitize(...)` inline |
| `SanitizedVariable` | `sanitizeHtml(...)` assigned to a variable first |
| `PlainJsxText` | `<h1>{post.title}</h1>` |

## Commands

```bash
semgrep --test --config rules/unsafe-html.yml tests/unsafe-html.tsx
scripts/run-tests.sh
```

## Results

| Date | Semgrep | Result |
|---|---|---|
| 2026-10-25 | 1.180.0 | `✓ All tests passed` (3 findings, 4 non-findings) |

## Failures and resolutions

| Date | Problem | Resolution |
|---|---|---|
| 2026-10-25 | The `SearchPage` annotation was written as a JSX comment (`{/* ruleid: ... */}`). Semgrep's test runner did not read it, so the finding on the next line was reported as unexpected. | Moved the element into a `const` with a normal `// ruleid:` comment above it. |

## Ad-hoc observations (2026-10-25)

- `__html: marked(md)` – reported (expected, Markdown output is HTML).
- `__html: DOMPurify.sanitize(a) + b` – reported (expected, unsanitized
  concatenation).
- `dangerouslySetInnerHTML={props.html}` – not reported (false negative).

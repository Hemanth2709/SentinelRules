# Unsafe HTML: remediation

## Vulnerable

```tsx
<div dangerouslySetInnerHTML={{ __html: comment.bodyHtml }} />
```

## Corrected

```tsx
import DOMPurify from 'isomorphic-dompurify';

const safeHtml = DOMPurify.sanitize(comment.bodyHtml, {
  ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'code'],
  ALLOWED_ATTR: ['href'],
});

<div dangerouslySetInnerHTML={{ __html: safeHtml }} />
```

Full files: [vulnerable](../../../examples/vulnerable/unsafe-html.tsx),
[secure](../../../examples/secure/unsafe-html.tsx).

## Why this fixes it

DOMPurify parses the HTML and removes elements and attributes outside the
allowlist, including event handlers and `javascript:` URLs.

## Preferred order of fixes

1. **Don't render HTML.** Render text with JSX, or store structured content
   and map it to components.
2. **Render Markdown without raw HTML** (e.g. `react-markdown` without
   `rehype-raw`).
3. **Sanitize at render time** with a maintained library and a small
   allowlist. Sanitize as late as possible; do not modify the string after
   sanitizing (e.g. `sanitize(a) + b` is reported by this rule).

## JSON-LD in `<script>` tags

`dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}` inside a
`<script>` tag is reported. `JSON.stringify` does not escape `</script>`, so a
value containing it can break out. Escape `<` (e.g.
`JSON.stringify(data).replace(/</g, '\\u003c')`) and confirm the source of
the data.

## Additional controls

- A Content-Security-Policy without `unsafe-inline` for scripts.
- HttpOnly session cookies (Rule 06) to limit what injected script can steal.

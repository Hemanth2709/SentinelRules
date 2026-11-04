# Unsafe HTML: limitations

## Known false positives

- JSON-LD built from static, developer-controlled data and serialized
  without escaping (observed in benchmark run 3). Escaping with
  `.replace(/</g, '\\u003c')` both removes the finding and protects against
  data that later becomes dynamic.
- HTML produced entirely by trusted code (e.g. a syntax highlighter run at
  build time on repository files).
- Values sanitized in another function or module before being passed in.
- Sanitizers not in the recognised list (e.g. `xss()`, `purify()` wrappers).

## Known false negatives

- Whole object passed as a variable: `dangerouslySetInnerHTML={props.html}`
  (confirmed in an ad-hoc scan on 2026-10-25).
- DOM sinks outside React (`innerHTML`, `insertAdjacentHTML`): covered since
  v0.3.0 by the taint rule `sentinel-dom-html-sink-user-input` when the
  value comes from the URL, the referrer, `useSearchParams()` or request data.
  HTML from an API response or a database is not a source.
- HTML parsers that render to React elements (`html-react-parser`).
- Calls named `sanitize` that do not actually sanitize, or DOMPurify with an
  unsafe configuration (e.g. allowing `<script>` or `on*` attributes).

## Patterns requiring manual review

All findings: provenance of the HTML must be traced by a reviewer.

## What the rule cannot establish

Whether the HTML is attacker-controlled, or whether a sanitizer's
configuration is adequate.

## Taint rule (`sentinel-dom-html-sink-user-input`, v0.3.0)

- Sources are the URL (`location.*`, `document.URL`), `document.referrer`,
  `window.name`, `useSearchParams()` and server request data. Stored XSS
  (HTML saved earlier and rendered later) has no source here.
- Express responses are sinks only when the string is built in the call
  (template or `+`) or after `res.type('html')`, because objects are sent as
  JSON. A string variable sent with `res.send(variable)` is not reported.
- Sanitizers are recognised by name (`DOMPurify.sanitize`, `sanitizeHtml`,
  `escape*`, `encode*`, `sanitize*`, `purify`); whether they really sanitize
  is not checked.
- `dangerouslySetInnerHTML` stays with `sentinel-react-dangerously-set-inner-html`;
  the taint rule does not report it, so the two rules do not overlap.

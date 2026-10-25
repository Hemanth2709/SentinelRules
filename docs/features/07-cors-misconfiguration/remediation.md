# CORS: remediation

## Vulnerable

```ts
app.enableCors({ origin: true, credentials: true });
```

## Corrected

```ts
const ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS ?? 'https://app.example.com')
  .split(',')
  .map((origin) => origin.trim());

app.enableCors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
});
```

Full files: [vulnerable](../../../examples/vulnerable/cors-misconfiguration.ts),
[secure](../../../examples/secure/cors-misconfiguration.ts).

## Why this fixes it

The `cors` package compares the request's `Origin` with each entry and only
sets `Access-Control-Allow-Origin` when it matches exactly. Other sites can
still send requests, but the browser will not let them read responses.

## Guidance

- Use exact string matches. If you need a pattern, anchor it fully:
  `/^https:\/\/([a-z0-9-]+\.)?example\.com$/`.
- Do not include `null` as an allowed origin (sandboxed iframes and `file:`
  pages send `Origin: null`).
- If the API does not use cookies, drop `credentials: true`.
- Configure the allowlist per environment rather than relaxing it for
  development.

## Additional controls

- `SameSite=Lax` or `Strict` session cookies (Rule 06).
- CSRF protection for state-changing endpoints.

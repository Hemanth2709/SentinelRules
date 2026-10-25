# Insecure cookies: remediation

## Vulnerable

```ts
res.cookie('session_token', sessionToken);
```

## Corrected

```ts
res.cookie('session_token', sessionToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 1000,
});
```

Next.js App Router:

```ts
(await cookies()).set('session', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
});
```

Full files: [vulnerable](../../../examples/vulnerable/insecure-cookies.ts),
[secure](../../../examples/secure/insecure-cookies.ts).

## Choosing `sameSite`

| Value | Use when |
|---|---|
| `strict` | The cookie is never needed on navigation from other sites |
| `lax` | Default choice for session cookies; sent on top-level GET navigation |
| `none` | The front end and API are on different sites and need the cookie cross-site. Requires `secure: true` and CSRF protection |

## Additional controls

- Use a `__Host-` cookie name prefix where possible (requires `Secure`,
  `Path=/`, and no `Domain`).
- Keep session lifetimes short and rotate the session ID after login.
- Add CSRF tokens or origin checks for state-changing requests if
  `sameSite: 'none'` is used.

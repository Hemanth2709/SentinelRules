# Open redirect: remediation

```ts
// Vulnerable
const next = new URL(request.url).searchParams.get('next') ?? '/';
return NextResponse.redirect(new URL(next, request.url));
```

```ts
// Corrected: same-site paths only
function isSafeRedirect(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\');
}
if (!isSafeRedirect(next)) return NextResponse.redirect(new URL('/', request.url));
return NextResponse.redirect(new URL(next, request.url));
```

Better still, accept a key and map it to fixed destinations
(`DESTINATIONS[key] ?? '/'`). For OAuth, register exact redirect URIs with the
provider.

Full examples: [vulnerable](../../../examples/vulnerable/open-redirect.ts) · [secure](../../../examples/secure/open-redirect.ts)

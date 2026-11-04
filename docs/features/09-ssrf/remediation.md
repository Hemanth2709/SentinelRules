# SSRF: remediation

```ts
// Vulnerable
const target = new URL(request.url).searchParams.get('url') ?? '';
const page = await fetch(target);
```

```ts
// Corrected: exact host allowlist, HTTPS only, no redirects
const ALLOWED_HOSTS = new Set(['example.com', 'www.example.com']);
function isAllowedUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ALLOWED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}
if (!isAllowedUrl(target)) return Response.json({ error: 'URL not allowed' }, { status: 400 });
const page = await fetch(target, { redirect: 'error' });
```

Also:

- Prefer a fixed origin in code (`https://api.example.com/items/${encodeURIComponent(id)}`).
- Refuse redirects, or re-check each redirect target.
- Block private, loopback and link-local addresses at the network layer
  (egress rules, IMDSv2 on AWS); an allowlist in code does not stop DNS
  rebinding on its own.

Full examples: [vulnerable](../../../examples/vulnerable/ssrf.ts) · [secure](../../../examples/secure/ssrf.ts)

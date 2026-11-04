# Image remotePatterns: detection logic

Rule: [`rules/next-image-remote-patterns.yml`](../../../rules/next-image-remote-patterns.yml)

**Scope:** objects inside `{ ..., remotePatterns: [...], ... }` (the
`images` block of a config object).

**Match:**

- an entry `{ ..., hostname: "$HOST", ... }` where `$HOST` is `*` or `**`;
- an entry `new URL("$URL")` whose host part is `*` or `**`.

Subdomain wildcards such as `'**.example.com'` are not reported: they are
limited to a domain the site controls.

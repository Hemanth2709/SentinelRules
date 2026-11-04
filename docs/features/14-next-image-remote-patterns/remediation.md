# Image remotePatterns: remediation

```ts
// Vulnerable
images: {
  remotePatterns: [{ protocol: 'https', hostname: '**' }],
},
```

```ts
// Corrected: exact hosts, and a path where possible
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.example.com', pathname: '/uploads/**' },
    { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
  ],
},
```

If images can come from anywhere (user-supplied avatars), download and store
them yourself first, then serve them from your own host.

Full examples: [vulnerable](../../../examples/vulnerable/next-image-remote-patterns.ts) · [secure](../../../examples/secure/next-image-remote-patterns.ts)

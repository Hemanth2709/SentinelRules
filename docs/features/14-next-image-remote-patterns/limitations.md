# Image remotePatterns: limitations

All limitations of single-file analysis apply (no cross-file dataflow).

## False negatives

- Configs built dynamically (`remotePatterns: hosts.map(...)`, values from
  environment variables).
- The deprecated `images.domains` option.
- A broad but non-wildcard host (for example a shared hosting domain such as
  `'**.vercel.app'`), which allows anyone's deployment on that domain.

## False positives

- An object with `hostname: '**'` that sits inside some other
  `remotePatterns` array that is not the Next.js image config.

## Manual review

Check `images.dangerouslyAllowSVG`, too: with SVG allowed and no
`contentSecurityPolicy`, remote SVGs can carry scripts.

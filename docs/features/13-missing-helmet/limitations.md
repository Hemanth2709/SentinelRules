# Missing Helmet: limitations

All limitations of single-file analysis apply (no cross-file dataflow).

## False positives

- Headers set by a reverse proxy, CDN or platform (nginx, Cloudflare, Vercel
  `headers()`), which the rule cannot see.
- `helmet()` registered in another file (for example a `configureApp(app)`
  helper) or through an imported middleware with a different name.
- Pure JSON APIs used only server-to-server, where most headers do not matter.

## False negatives

- Apps created another way (`new Koa()`, `fastify()` without NestJS,
  `http.createServer`).
- `helmet()` registered with all protections disabled.
- Next.js apps: headers are configured in `next.config` `headers()` or
  middleware, which this rule does not check.

## Manual review

Check the real response headers of the deployed app (for example with
`curl -I`), not only the code.

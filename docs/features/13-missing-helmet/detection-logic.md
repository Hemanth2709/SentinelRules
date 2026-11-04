# Missing Helmet: detection logic

Rule: [`rules/missing-helmet.yml`](../../../rules/missing-helmet.yml)

**Scope:** the statements after `$APP = await NestFactory.create(...)` (with
or without a type argument) or `$APP = express()` in the same block.

**Match:** `$APP.listen(...)`.

**Not reported when** an earlier statement in that block is
`$APP.use(helmet(...))`, `$APP.use(helmet)`, or `register(helmet, ...)` /
`register(fastifyHelmet, ...)` (Fastify adapter). The Fastify names are listed
explicitly: a metavariable bound only inside a negation cannot be filtered with
`metavariable-regex` (see AGENTS.md gotchas).

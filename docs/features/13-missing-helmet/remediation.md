# Missing Helmet: remediation

```ts
// Vulnerable
const app = await NestFactory.create(AppModule);
await app.listen(3000);
```

```ts
// Corrected
import helmet from 'helmet';

const app = await NestFactory.create(AppModule);
app.use(helmet());
await app.listen(3000);
```

On the Fastify adapter use `await app.register(fastifyHelmet)` from
`@fastify/helmet`. Review the default Content-Security-Policy if the app
serves inline scripts (for example Swagger UI).

Full examples: [vulnerable](../../../examples/vulnerable/missing-helmet.ts) · [secure](../../../examples/secure/missing-helmet.ts)

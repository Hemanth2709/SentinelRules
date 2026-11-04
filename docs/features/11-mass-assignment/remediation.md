# Mass assignment: remediation

```ts
// Vulnerable
const body = await request.json();
await prisma.user.update({ where: { id: session.userId }, data: body });
```

```ts
// Corrected: a schema that lists the editable fields
const UpdateProfile = z.object({ name: z.string().max(100), bio: z.string().max(500).optional() });
const data = UpdateProfile.parse(await request.json());
await prisma.user.update({ where: { id: session.userId }, data });
```

In NestJS, use a DTO class with `ValidationPipe({ whitelist: true })` (and
`forbidNonWhitelisted: true` to reject extra keys outright).

Full examples: [vulnerable](../../../examples/vulnerable/mass-assignment.ts) · [secure](../../../examples/secure/mass-assignment.ts)

# TypeScript security patterns

The vulnerable patterns detected by the rule pack.

## Dynamic SQL construction

```ts
prisma.$queryRawUnsafe(`SELECT * FROM "User" WHERE email = '${email}'`);
```

Data becomes SQL syntax. A tagged template (``$queryRaw`...${email}` ``)
looks almost identical but is safe – the difference is syntactic, which is
why a syntax-based rule can distinguish them.

## JWT verification configuration

```ts
super({ ignoreExpiration: true, ... });
jwt.verify(token, key); // algorithm chosen by the token header
```

A JWT is trustworthy only after signature, algorithm, and claims are checked.

## Input validation

```ts
new ValidationPipe({ transform: true }); // whitelist missing
```

TypeScript types are erased at runtime; `dto: UpdateProfileDto` does not
remove extra properties.

## Environment-variable exposure

```ts
process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY
```

The prefix makes Next.js inline the value into browser bundles.

## HTML rendering

```tsx
<div dangerouslySetInnerHTML={{ __html: userHtml }} />
```

Bypasses React's escaping.

## Cookie configuration

```ts
res.cookie('session_id', id); // no HttpOnly, Secure, SameSite
```

## CORS configuration

```ts
app.enableCors({ origin: true, credentials: true });
```

`origin: true` reflects any origin, which browsers accept with credentials.

## Authentication versus authorization

- **Authentication**: who is the caller? (`AuthGuard`, `getServerSession`)
- **Authorization**: may this caller do this to this resource?
  (`project.ownerId === user.id`)

A route can authenticate perfectly and still let any signed-in user delete
any project. The authorization rule can only detect the *absence of visible
authentication*; it cannot judge authorization logic.

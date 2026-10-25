# JWT misconfiguration: remediation

## Vulnerable

```ts
super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: true,
  secretOrKey: process.env.JWT_SECRET,
});

jwt.verify(token, process.env.WEBHOOK_PUBLIC_KEY as string);
```

## Corrected

```ts
super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  issuer: 'https://auth.example.com',
  audience: 'api.example.com',
});

jwt.verify(token, process.env.WEBHOOK_PUBLIC_KEY as string, {
  algorithms: ['RS256'],
  issuer: 'https://webhooks.example.com',
  maxAge: '5m',
});
```

Full files: [vulnerable](../../../examples/vulnerable/jwt-misconfiguration.ts),
[secure](../../../examples/secure/jwt-misconfiguration.ts).

## Why this fixes it

- Removing `ignoreExpiration: true` (or setting it to `false`) restores the
  `exp` check that the libraries perform by default.
- `algorithms` makes the verifier reject any token whose header names a
  different algorithm, closing algorithm-confusion attacks.
- `issuer` / `audience` stop tokens minted for another service from being
  accepted.

## Framework guidance

- `@nestjs/jwt`: set `signOptions.expiresIn` and
  `verifyOptions: { algorithms, issuer, audience }` in `JwtModule.register`.
- `passport-jwt`: pass `algorithms`, `issuer`, `audience`; leave
  `ignoreExpiration` unset or `false`.
- `jsonwebtoken`: always pass an options object with `algorithms`.

## Additional controls

- Short access-token lifetimes with refresh-token rotation.
- A revocation strategy (token version on the user record, deny-list) for
  logout and account disablement.
- Separate keys per environment and per purpose.

# ValidationPipe: detection logic

Rule: [`rules/validation-pipe.yml`](../../../rules/validation-pipe.yml)

```yaml
pattern-either:
  - pattern: new ValidationPipe()
  - pattern: "{..., provide: APP_PIPE, ..., useClass: ValidationPipe, ...}"
  - patterns:
      - pattern: new ValidationPipe({...})
      - pattern-not: "new ValidationPipe({..., whitelist: true, ...})"
      - pattern-not: "new ValidationPipe({..., ...$SPREAD, ...})"
```

## Why these patterns

- Matching the constructor (rather than `useGlobalPipes`) covers every place
  a pipe can be attached: `app.useGlobalPipes`, `@UsePipes`, `@Body(pipe)`,
  and `APP_PIPE` providers with `useValue`.
- `useClass: ValidationPipe` means Nest instantiates the pipe with default
  options, which is equivalent to `new ValidationPipe()`.
- Semgrep's object patterns are order-independent, so `whitelist: true` is
  recognised anywhere in the options object.
- `whitelist: false` and `whitelist: someVariable` are reported because they
  are not literally `true`.

## Safe patterns that should not match

- `new ValidationPipe({ whitelist: true, ... })`
- `new ValidationPipe(options)` – options variable, not inspectable.
- `new ValidationPipe({ ...shared, ... })` – the spread may provide
  `whitelist`.

## Why the detector may miss cases

- Options defined in a variable or another module.
- Subclasses of `ValidationPipe` or custom validation pipes.
- Pipes created through factories (`useFactory`).

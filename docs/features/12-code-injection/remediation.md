# Code injection: remediation

```ts
// Vulnerable
const { formula } = await request.json();
const result = new Function(`return (${formula});`)();
```

```ts
// Corrected: the client picks an operation by name; the code is fixed
const OPERATIONS: Record<string, (a: number, b: number) => number> = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
};
const operation = OPERATIONS[op];
if (!operation) return Response.json({ error: 'invalid input' }, { status: 400 });
return Response.json({ result: operation(a, b) });
```

For user-defined expressions, use a parser that only evaluates a restricted
grammar (for example a math-expression library), never `eval` or `vm`.

Full examples: [vulnerable](../../../examples/vulnerable/code-injection.ts) · [secure](../../../examples/secure/code-injection.ts)

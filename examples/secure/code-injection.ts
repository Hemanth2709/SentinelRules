// SECURE EXAMPLE
// app/api/calculate/route.ts

// The client chooses an operation by name; the code that runs is fixed.
const OPERATIONS: Record<string, (a: number, b: number) => number> = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
};

export async function POST(request: Request) {
  const { op, a, b } = await request.json();
  const operation = OPERATIONS[op];
  if (!operation || typeof a !== 'number' || typeof b !== 'number') {
    return Response.json({ error: 'invalid input' }, { status: 400 });
  }
  return Response.json({ result: operation(a, b) });
}

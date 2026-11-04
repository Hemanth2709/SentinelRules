// VULNERABLE EXAMPLE - do not copy into production code.
// app/api/calculate/route.ts

export async function POST(request: Request) {
  const { formula } = await request.json();
  // A "formula" such as process.env.DATABASE_URL or
  // require('child_process').execSync('id') runs on the server.
  const result = new Function(`return (${formula});`)();
  return Response.json({ result });
}

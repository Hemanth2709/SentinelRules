// VULNERABLE EXAMPLE - do not copy into production code.
// app/api/link-preview/route.ts

export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get('url') ?? '';
  // The server fetches whatever URL the caller supplies, including
  // http://169.254.169.254/latest/meta-data/ (cloud credentials) or
  // http://localhost:6379 (internal services the attacker cannot reach).
  const page = await fetch(target);
  const html = await page.text();
  const title = /<title>(.*?)<\/title>/i.exec(html)?.[1] ?? '';
  return Response.json({ title });
}

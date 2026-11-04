// SECURE EXAMPLE
// app/api/link-preview/route.ts

const ALLOWED_HOSTS = new Set(['example.com', 'www.example.com', 'blog.example.com']);

function isAllowedUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  // Exact host allowlist over HTTPS only. Redirects are refused below, so the
  // checked host is the host that is actually contacted.
  return url.protocol === 'https:' && ALLOWED_HOSTS.has(url.hostname);
}

export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get('url') ?? '';
  if (!isAllowedUrl(target)) {
    return Response.json({ error: 'URL not allowed' }, { status: 400 });
  }
  const page = await fetch(target, { redirect: 'error' });
  const html = await page.text();
  const title = /<title>(.*?)<\/title>/i.exec(html)?.[1] ?? '';
  return Response.json({ title });
}

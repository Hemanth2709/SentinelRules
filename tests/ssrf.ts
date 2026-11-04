// Test fixtures for rules/ssrf.yml

import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import express, { Request as ExpressRequest, Response } from 'express';
import { NextRequest } from 'next/server';

const app = express();
declare function isAllowedUrl(url: string): boolean;
declare function assertAllowedUrl(url: string): void;

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

// Next.js route handler: URL from the query string.
export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get('url') ?? '';
  // ruleid: sentinel-ssrf-user-controlled-url
  const upstream = await fetch(target);
  return new Response(upstream.body);
}

// NextRequest.nextUrl, sent through axios.
export async function PUT(request: NextRequest) {
  const webhook = request.nextUrl.searchParams.get('webhook');
  // ruleid: sentinel-ssrf-user-controlled-url
  await axios.post(webhook as string, { ok: true });
  return Response.json({ sent: true });
}

// JSON body, destructured.
export async function POST(request: Request) {
  const { callbackUrl } = await request.json();
  // ruleid: sentinel-ssrf-user-controlled-url
  await fetch(callbackUrl, { method: 'POST' });
  return Response.json({ ok: true });
}

// User value at the start of a template literal still controls the host.
export async function PATCH(request: Request) {
  const base = new URL(request.url).searchParams.get('base');
  // ruleid: sentinel-ssrf-user-controlled-url
  const res = await fetch(`${base}/status`);
  return Response.json(await res.json());
}

// Server Action: a form field used as the URL.
export async function importFromUrl(formData: FormData) {
  'use server';
  const source = formData.get('source') as string;
  // ruleid: sentinel-ssrf-user-controlled-url
  const res = await fetch(source);
  return res.text();
}

// Express: req.query flows into fetch.
app.get('/preview', async (req: ExpressRequest, res: Response) => {
  // ruleid: sentinel-ssrf-user-controlled-url
  const page = await fetch(String(req.query.url));
  res.send(await page.text());
});

// NestJS: @Query() parameter into HttpService.
@Controller('proxy')
export class ProxyController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  fetchRemote(@Query('url') url: string) {
    // ruleid: sentinel-ssrf-user-controlled-url
    return this.httpService.get(url);
  }

  @Post('import')
  async importFeed(@Body() body: { feedUrl: string }) {
    // ruleid: sentinel-ssrf-user-controlled-url
    const res = await axios.get(body.feedUrl);
    return res.data;
  }
}

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

// Constant URL.
export async function constantUrl() {
  // ok: sentinel-ssrf-user-controlled-url
  return fetch('https://api.example.com/health');
}

// Fixed origin; the user only controls a path segment, which encodeURIComponent
// keeps inside the path.
export async function fixedOrigin(request: Request) {
  const id = new URL(request.url).searchParams.get('id') ?? '';
  // ok: sentinel-ssrf-user-controlled-url
  return fetch(`https://api.example.com/items/${encodeURIComponent(id)}`);
}

// Checked against an allowlist first.
export async function allowlisted(request: Request) {
  const target = new URL(request.url).searchParams.get('url') ?? '';
  if (!isAllowedUrl(target)) {
    return new Response('forbidden', { status: 403 });
  }
  // ok: sentinel-ssrf-user-controlled-url
  return fetch(target);
}

// Asserted against an allowlist (throws otherwise).
export async function asserted(request: Request) {
  const { url } = await request.json();
  assertAllowedUrl(url);
  // ok: sentinel-ssrf-user-controlled-url
  return fetch(url);
}

// A key chosen by the user selects from a fixed map of upstreams.
const UPSTREAMS: Record<string, string> = {
  eu: 'https://eu.api.example.com',
  us: 'https://us.api.example.com',
};
export async function fromMap(request: Request) {
  const region = new URL(request.url).searchParams.get('region') ?? 'eu';
  const upstream = UPSTREAMS[region] ?? UPSTREAMS.eu;
  // ok: sentinel-ssrf-user-controlled-url
  return fetch(`${upstream}/status`);
}

// Map.get() with a user key is not an outbound request.
export function cacheLookup(request: Request, cache: Map<string, string>) {
  const key = new URL(request.url).searchParams.get('key') ?? '';
  // ok: sentinel-ssrf-user-controlled-url
  return cache.get(key);
}

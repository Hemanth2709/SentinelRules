// Test fixtures for rules/unsafe-html-tainted.yml (v0.3.0, taint mode).
// URL or request data written into HTML outside React's escaping:
// DOM sinks in the browser and HTML responses on the server.

'use client';

import DOMPurify from 'isomorphic-dompurify';
import type { Request, Response } from 'express';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

// ---------------------------------------------------------------------------
// Expected findings: browser DOM sinks
// ---------------------------------------------------------------------------

export function showGreeting() {
  const name = new URLSearchParams(window.location.search).get('name') ?? '';
  const el = document.getElementById('greeting')!;
  // ruleid: sentinel-dom-html-sink-user-input
  el.innerHTML = `<b>Hello ${name}</b>`;
}

export function showFragment() {
  // ruleid: sentinel-dom-html-sink-user-input
  document.body.insertAdjacentHTML('beforeend', decodeURIComponent(location.hash.slice(1)));
}

export function Banner() {
  const params = useSearchParams();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const message = params.get('message') ?? '';
    // ruleid: sentinel-dom-html-sink-user-input
    if (ref.current) ref.current.innerHTML = message;
  }, [params]);
  return <div ref={ref} />;
}

export function legacyWrite() {
  // ruleid: sentinel-dom-html-sink-user-input
  document.write('<p>' + document.referrer + '</p>');
}

// ---------------------------------------------------------------------------
// Expected findings: server HTML responses
// ---------------------------------------------------------------------------

export function searchPage(req: Request, res: Response) {
  // ruleid: sentinel-dom-html-sink-user-input
  res.send(`<h1>Results for ${req.query.q}</h1>`);
}

@Controller('welcome')
export class WelcomeController {
  @Get()
  welcome(@Query('name') name: string, @Res() res: Response) {
    const html = '<p>Welcome, ' + name + '</p>';
    // ruleid: sentinel-dom-html-sink-user-input
    res.type('html').send(html);
  }
}

export async function GET(request: globalThis.Request) {
  const q = new URL(request.url).searchParams.get('q');
  // ruleid: sentinel-dom-html-sink-user-input
  return new Response(`<p>${q}</p>`, { headers: { 'Content-Type': 'text/html' } });
}

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

export function safeText() {
  const name = new URLSearchParams(window.location.search).get('name') ?? '';
  // textContent never parses HTML.
  // ok: sentinel-dom-html-sink-user-input
  document.getElementById('greeting')!.textContent = `Hello ${name}`;
}

export function sanitized() {
  const html = new URLSearchParams(location.search).get('html') ?? '';
  // ok: sentinel-dom-html-sink-user-input
  document.getElementById('preview')!.innerHTML = DOMPurify.sanitize(html);
}

export function constantMarkup() {
  // ok: sentinel-dom-html-sink-user-input
  document.getElementById('spinner')!.innerHTML = '<span class="spin"></span>';
}

export function jsonResponse(req: Request, res: Response) {
  // An object is sent as JSON (application/json), not HTML.
  // ok: sentinel-dom-html-sink-user-input
  res.send({ query: req.query.q });
}

export function escapedResponse(req: Request, res: Response) {
  // ok: sentinel-dom-html-sink-user-input
  res.send(`<h1>Results for ${escapeHtml(String(req.query.q))}</h1>`);
}

export async function jsonRoute(request: globalThis.Request) {
  const q = new URL(request.url).searchParams.get('q');
  // ok: sentinel-dom-html-sink-user-input
  return Response.json({ q });
}

declare function escapeHtml(s: string): string;

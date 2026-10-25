// Test fixtures for rules/unsafe-html.yml

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import sanitizeHtml from 'sanitize-html';

type Post = { title: string; bodyHtml: string };

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

export function PostBody({ post }: { post: Post }) {
  // ruleid: sentinel-react-dangerously-set-inner-html
  return <article className="prose" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />;
}

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  // ruleid: sentinel-react-dangerously-set-inner-html
  const heading = <p dangerouslySetInnerHTML={{ __html: `Results for <b>${searchParams.q}</b>` }} />;
  return <div>{heading}</div>;
}

export function CreateElementBanner({ html }: { html: string }) {
  // ruleid: sentinel-react-dangerously-set-inner-html
  return React.createElement('div', { dangerouslySetInnerHTML: { __html: html } });
}

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

export function StaticNotice() {
  // ok: sentinel-react-dangerously-set-inner-html
  return <span dangerouslySetInnerHTML={{ __html: '&copy; 2026 Sentinel Rules' }} />;
}

export function SanitizedInline({ post }: { post: Post }) {
  // ok: sentinel-react-dangerously-set-inner-html
  return <article dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.bodyHtml) }} />;
}

export function SanitizedVariable({ post }: { post: Post }) {
  const clean = sanitizeHtml(post.bodyHtml, { allowedTags: ['b', 'i', 'a', 'p'] });
  // ok: sentinel-react-dangerously-set-inner-html
  return <article dangerouslySetInnerHTML={{ __html: clean }} />;
}

export function PlainJsxText({ post }: { post: Post }) {
  // React escapes text children; no raw HTML is rendered.
  // ok: sentinel-react-dangerously-set-inner-html
  return <h1>{post.title}</h1>;
}

// Test fixtures for rules/code-injection.yml

import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import express, { Request as ExpressRequest, Response } from 'express';
import vm from 'node:vm';

const app = express();

// ---------------------------------------------------------------------------
// Expected findings
// ---------------------------------------------------------------------------

// Next.js route handler: a "formula" from the query string is evaluated.
export async function GET(request: Request) {
  const formula = new URL(request.url).searchParams.get('formula') ?? '0';
  // ruleid: sentinel-code-injection-eval-user-input
  const result = eval(formula);
  return Response.json({ result });
}

// JSON body compiled with new Function.
export async function POST(request: Request) {
  const { expression } = await request.json();
  // ruleid: sentinel-code-injection-eval-user-input
  const fn = new Function('x', `return ${expression};`);
  return Response.json({ value: fn(2) });
}

// Express: node:vm is not a security sandbox.
app.post('/run', (req: ExpressRequest, res: Response) => {
  // ruleid: sentinel-code-injection-eval-user-input
  const out = vm.runInNewContext(req.body.code, {});
  res.json({ out });
});

// String passed to setTimeout is compiled like eval.
app.get('/delay', (req: ExpressRequest, res: Response) => {
  // ruleid: sentinel-code-injection-eval-user-input
  setTimeout(String(req.query.callback), 10);
  res.sendStatus(204);
});

// NestJS: decorated parameters.
@Controller('rules')
export class RulesController {
  @Post('test')
  test(@Body() body: { condition: string }) {
    // ruleid: sentinel-code-injection-eval-user-input
    return { matches: Function('order', `return (${body.condition});`)({ total: 10 }) };
  }

  @Get('script')
  script(@Query('src') src: string) {
    // ruleid: sentinel-code-injection-eval-user-input
    return new vm.Script(src).runInThisContext();
  }
}

// ---------------------------------------------------------------------------
// Expected non-findings
// ---------------------------------------------------------------------------

// Constant code.
export function constantEval() {
  // ok: sentinel-code-injection-eval-user-input
  return eval('1 + 1');
}

// User value is data, parsed as JSON, never executed.
export async function parseOnly(request: Request) {
  const raw = new URL(request.url).searchParams.get('filters') ?? '{}';
  // ok: sentinel-code-injection-eval-user-input
  const filters = JSON.parse(raw);
  return Response.json(filters);
}

// User value picks one of several fixed functions.
const OPERATIONS: Record<string, (a: number, b: number) => number> = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
};
export async function dispatch(request: Request) {
  const op = new URL(request.url).searchParams.get('op') ?? 'add';
  // ok: sentinel-code-injection-eval-user-input
  const result = (OPERATIONS[op] ?? OPERATIONS.add)(2, 3);
  return Response.json({ result });
}

// setTimeout with a function, not a string.
app.get('/later', (req: ExpressRequest, res: Response) => {
  const name = String(req.query.name);
  // ok: sentinel-code-injection-eval-user-input
  setTimeout(() => console.log(`hello ${name}`), 10);
  res.sendStatus(204);
});

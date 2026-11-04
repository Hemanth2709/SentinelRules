# Rule 12: Code injection (eval)

| | |
|---|---|
| Rule ID | `sentinel-code-injection-eval-user-input` |
| Rule file | [`rules/code-injection.yml`](../../../rules/code-injection.yml) |
| Test fixture | [`tests/code-injection.ts`](../../../tests/code-injection.ts) |
| Examples | [vulnerable](../../../examples/vulnerable/code-injection.ts) · [secure](../../../examples/secure/code-injection.ts) |
| Severity | ERROR |
| Confidence | HIGH |
| CWE | CWE-95, CWE-94 |
| OWASP | A03:2021 Injection |
| Status | Released (v0.2.0) |

## Purpose

Flags request data that is executed as code: `eval`, `new Function` / `Function`, a string passed to `setTimeout` / `setInterval`, and `node:vm` (`runInNewContext`, `runInThisContext`, `runInContext`, `compileFunction`, `new vm.Script`).

This is a taint-mode rule: it follows a value from the request to the
dangerous call within one file ([DEC-010](../../decisions/decision-log.md)).

## Running the tests

```bash
semgrep --test --config rules/code-injection.yml tests/code-injection.ts
```

## Interpreting a finding

Treat this as a real vulnerability unless the value cannot come from a user. `node:vm` is not a sandbox: code can escape it and reach `process`.

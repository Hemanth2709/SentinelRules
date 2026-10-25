# False-positive considerations

This page summarises the false-positive classes documented per rule. Each
item was either observed in fixtures/ad-hoc scans during development or is a
known structural limitation of single-file pattern matching. Benchmark
observations against a real application will be added to
[benchmark-results.md](benchmark-results.md) once the scan has been done.

| Rule | Main false-positive class | Mitigation |
|---|---|---|
| SQL injection | Dynamic but trusted values (internal enums); constant `'a' + 'b'` concatenation | Allowlist identifiers explicitly; `nosemgrep` with reason |
| JWT ignore-expiration | Deliberate refresh-flow decoding | `nosemgrep` with reason |
| JWT missing algorithms | Library version / key type already restricts algorithms | Pin `algorithms` anyway |
| ValidationPipe | Global pipe with `whitelist` already runs; conditional `whitelist: isProd` | Configure one global pipe |
| Public secrets | Indicator word in a non-secret name (`NEXT_PUBLIC_PRIVATE_BETA_ENABLED`) | Rename |
| Unsafe HTML | Trusted HTML; sanitized in another function | `nosemgrep` with provenance note |
| Insecure cookies | Cookies meant to be JS-readable (`csrf_token` double-submit) | `nosemgrep` with reason |
| CORS | Header-only authentication | Drop `credentials: true` |
| Missing authorization | Global guards; intentionally public endpoints (login) | `@Public()` marker; disable rule if global guards are used consistently |

## Handling a false positive

1. Confirm it is a false positive (write down why).
2. If the code can be made clearer (e.g. allowlist, explicit `@Public()`),
   prefer that.
3. Otherwise suppress with `// nosemgrep: <rule-id> -- <reason>`.
4. If the pattern is common, open an issue or PR with a fixture that
   reproduces it, so the rule can be refined with a regression test.

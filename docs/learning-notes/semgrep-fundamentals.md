# Semgrep fundamentals

## Static analysis

Static analysis inspects source code without running it. It can find
patterns everywhere in a codebase quickly, but it only sees the code it is
given and must approximate runtime behaviour.

## How Semgrep matches

Semgrep parses code into an abstract syntax tree and matches patterns that
look like the target language. `$DB.query(...)` matches any call to a
`query` method on any receiver with any arguments, regardless of whitespace,
comments, or formatting.

## Metavariables and composition

| Construct | Meaning |
|---|---|
| `$X` | Any expression; remembered and must be equal if reused |
| `...` | Any sequence of arguments, statements, or object properties |
| `"..."` / `'...'` | Any string literal |
| `<... $X ...>` | An expression containing `$X` somewhere |
| `pattern-either` | OR |
| `patterns` | AND |
| `pattern-not` | Exclude matches of the same shape |
| `pattern-inside` / `pattern-not-inside` | Require / forbid enclosing code |
| `metavariable-regex` | Constrain a metavariable's text with a regex |
| `metavariable-pattern` | Match a sub-pattern against a metavariable |
| `focus-metavariable` | Report only the metavariable's range |

## Rule metadata

Metadata does not affect matching. It carries the CWE, OWASP category,
confidence, and references, so that findings can be triaged and reported.

## Test annotations

```ts
// ruleid: sentinel-cors-credentials-any-origin
app.enableCors({ origin: true, credentials: true });

// ok: sentinel-cors-credentials-any-origin
app.enableCors({ origin: allowlist, credentials: true });
```

`semgrep --test` fails if a `ruleid` line has no finding or an unannotated
line has one. It compares **lines**, so it does not notice duplicate findings
on the same line.

## Limitations of syntax-based analysis

- No knowledge of runtime values: a variable named `sql` might be constant.
- Limited dataflow: these rules look within one scope or one file.
- No type information: `.query()` on a GraphQL client looks like
  `.query()` on a database pool.
- Configuration in other files (global guards, shared options) is invisible.

# Rule-writing guide

This guide explains how rules in this repository are written, using the SQL
injection rule as the running example.

## 1. Start from a concrete vulnerable snippet

```ts
prisma.$queryRawUnsafe(`SELECT * FROM "User" WHERE email = '${email}'`);
```

and a safe counterpart:

```ts
prisma.$queryRaw`SELECT * FROM "User" WHERE email = ${email}`;
```

Write both into the fixture before writing the rule.

## 2. Match the sink

```yaml
- pattern: $DB.$METHOD($SQLSTR, ...)
- metavariable-regex:
    metavariable: $METHOD
    regex: ^(\$queryRawUnsafe|\$executeRawUnsafe|query|raw|execute)$
```

- `$DB`, `$METHOD`, `$SQLSTR` are **metavariables**: they match any
  expression and remember it.
- `...` matches any remaining arguments.
- `metavariable-regex` constrains what a metavariable may be.

## 3. Constrain the dangerous part

```yaml
- metavariable-pattern:
    metavariable: $SQLSTR
    pattern-either:
      - pattern: "`...${$E}...`"
      - pattern: $A + $B
```

`metavariable-pattern` runs a sub-pattern on what a metavariable matched.

## 4. Exclude safe forms

Use `pattern-not` (same location) and `pattern-not-inside` (enclosing code).
For example, the unsafe-HTML rule excludes sanitized values:

```yaml
- pattern-not: "{__html: DOMPurify.sanitize(...)}"
- pattern-not-inside: |
    $HTML = $PURIFY.sanitize(...);
    ...
```

## 5. Point the finding at the right place

`focus-metavariable: $VALUE` moves the reported range to that metavariable.

## 6. Write the message for the developer

State what was found, why it matters, and what to do. Mention when manual
review is required.

**Do not put `$`-prefixed words in the message unless they are bound
metavariables.** `$1` and `$queryRaw` in an early SQL message were treated as
metavariables and caused duplicate findings.

## 7. Add metadata

```yaml
metadata:
  category: security
  subcategory: [vuln]        # or audit
  confidence: MEDIUM
  likelihood: MEDIUM
  impact: HIGH
  technology: [nestjs, prisma]
  cwe: ["CWE-89: ..."]
  owasp: ["A03:2021 - Injection"]
  references: [https://...]
  documentation: docs/features/01-sql-injection/README.md
```

Confirm that each CWE and OWASP category actually fits the detected weakness
(see [security-mappings.md](security-mappings.md)).

## 8. Test

```bash
semgrep --validate --config rules/<name>.yml
semgrep --test --config rules/<name>.yml tests/<name>.ts
```

Then scan the fixture directly to look for duplicate findings, which
`--test` does not report:

```bash
semgrep scan --config rules/<name>.yml tests/<name>.ts --json
```

## Semgrep behaviours learned in this project

| Behaviour | Consequence |
|---|---|
| Object patterns `{..., a: 1, ...}` are order-independent | One pattern covers any property order |
| Object-literal matches are reported at the opening brace | Put `ruleid:` above the line with `{` |
| `pattern-not` must match the same form as the positive pattern | `function $F` does not negate `export function $F` |
| `export function $F` also matches `export async function $F` | One pattern per form |
| A metavariable bound only in a negative pattern cannot be used in `metavariable-regex` | List alternatives explicitly |
| A bare `pattern-not` cannot be a branch of `pattern-either` | Wrap it in `patterns` with a positive `pattern` |
| Annotations in JSX `{/* */}` comments are not read by `--test` | Use `//` comments outside JSX |
| `semgrep scan` ignores `tests/` directories by default | Pass fixture files explicitly when scanning them |

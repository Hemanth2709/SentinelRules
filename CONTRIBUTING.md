# Contributing

Thanks for helping improve Sentinel Rules.

## Scope

Rules target NestJS and Next.js code in TypeScript/JavaScript. New rules
should detect a specific, explainable pattern and stay within the project
scope described in [docs/project-overview.md](docs/project-overview.md).

## Changing or adding a rule

1. Install the pinned Semgrep version (see [docs/setup-guide.md](docs/setup-guide.md)).
2. Add fixtures first: at least two `// ruleid:` and two `// ok:` cases in
   `tests/<name>.ts` that cover different variations.
3. Write or change the rule in `rules/<name>.yml`. Rule IDs start with
   `sentinel-`; include the standard metadata (see
   [docs/rule-writing-guide.md](docs/rule-writing-guide.md)).
4. Add or update `examples/vulnerable/<name>.ts` and
   `examples/secure/<name>.ts`.
5. Run:
   ```bash
   semgrep --validate --config rules/
   semgrep --test --config rules/ tests/
   scripts/check-examples.sh
   ```
6. Update the feature's `testing-notes.md`, `limitations.md`, and
   `implementation-log.md` with what actually changed and the real results.

## Ground rules

- Do not weaken a negative test to make a rule pass.
- Do not record results, dates, or findings that did not happen.
- Fixtures and examples must not contain real secrets or code copied from
  private applications.
- Only scan applications you own or have permission to scan.

## Reporting false positives / negatives

Open an issue with a minimal code snippet, the rule ID, and the Semgrep
version.

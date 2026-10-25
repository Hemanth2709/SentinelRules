# Architecture

```
rules/<name>.yml          Semgrep rule definitions (one file per feature;
                          a file may hold more than one rule ID)
tests/<name>.ts|tsx       Annotated fixtures; paired with rules by base name
examples/vulnerable/      Realistic vulnerable code, one file per feature
examples/secure/          The corrected version of each vulnerable example
scripts/check-examples.sh Checks each rule fires on its vulnerable example
                          and not on its secure example
.github/workflows/        CI: validate, test, check examples
docs/                     Guides, per-feature docs, logs, benchmark
```

## How the pieces fit

1. A rule in `rules/` describes a pattern.
2. `semgrep --test --config rules/ tests/` runs each rule file against the
   fixture with the same base name and compares findings with the `ruleid:` /
   `ok:` annotations.
3. `scripts/check-examples.sh` gives a second, coarser check on realistic
   code.
4. CI runs both on every push and pull request.

## Rule IDs and metadata

Every rule ID starts with `sentinel-`. Every rule carries `category`,
`subcategory`, `confidence`, `likelihood`, `impact`, `technology`, `cwe`,
`owasp`, `references`, and a `documentation` link to its feature folder.

`subcategory: vuln` marks rules where the pattern itself is the weakness
(e.g. `ignoreExpiration: true`); `subcategory: audit` marks rules that
identify code for review (e.g. missing authorization).

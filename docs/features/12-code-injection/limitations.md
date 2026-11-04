# Code injection: limitations

All limitations of single-file analysis apply (no cross-file dataflow).

## False negatives

- Code that reaches `eval` through another function or file.
- Other evaluators: template engines compiled from user input, `require` of a
  user path, `child_process` (command injection is a separate weakness).

## False positives

- Values that look request-derived but are fixed by an earlier check the rule
  cannot see. These are rare; prefer removing `eval` over suppressing.

## Manual review

Search for `eval`, `Function(` and `vm.` across the codebase; any use on data
that is not a constant deserves review.

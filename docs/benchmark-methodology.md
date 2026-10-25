# Benchmark methodology

## Goal

Measure how the rule pack behaves on a real codebase by manually reviewing
every finding.

## Target selection

- An application the maintainer owns, or has written permission to scan.
- Built with NestJS and/or Next.js in TypeScript.
- Record: repository, commit SHA, date, and permission basis.

## Procedure

1. Record the Semgrep version and the Sentinel Rules commit.
2. Run:
   ```bash
   semgrep scan --metrics=off --config rules/ --json --output findings.json <app>
   ```
3. Record total findings per rule ID.
4. Review each finding in context and classify it:

   | Class | Definition |
   |---|---|
   | True positive (TP) | The code exhibits the weakness the rule describes, and it is reachable in the application |
   | False positive (FP) | The code does not exhibit the weakness (e.g. a global guard protects the route; the value is constant) |
   | Unresolved | Cannot be decided without information not available to the reviewer |

   Write the reason for each classification.
5. Where practical, hand-review a defined set of files (for example all
   controllers and route handlers) for weaknesses the rules should catch, to
   find false negatives.
6. If a rule is changed as a result, add a regression fixture, re-run
   `semgrep --test`, and re-scan.

## Metrics

| Metric | Definition |
|---|---|
| Total findings | Count of reported results |
| TP, FP, Unresolved | From manual review |
| Precision | TP / (TP + FP), excluding unresolved |
| Missed (FN) | Weaknesses found by manual review of the defined file set that the rules did not report |
| Recall | TP / (TP + FN), **only** reported when the manually reviewed set is defined and documented |

A false-positive *rate* (FP / (FP + TN)) is not reported unless true
negatives can be counted with a documented denominator; precision and the
observed FP count are reported instead.

## Reporting rules

- No findings does not mean no vulnerabilities.
- Do not publish sensitive details (exploitable endpoints, secrets) from a
  private application; describe them at the level needed to justify the
  classification.

# Project overview

Sentinel Rules is a focused collection of custom Semgrep rules for NestJS and
Next.js applications written in TypeScript or JavaScript. It is meant to
complement general-purpose SAST tools, not replace them.

## Objectives

- At least eight custom rules, each with at least two positive and two
  negative test cases.
- CWE and OWASP Top 10 (2021) mapping for every rule.
- Vulnerable and secure examples and remediation guidance.
- Automated rule tests in GitHub Actions.
- A benchmark against an application scanned with permission, with manually
  reviewed findings.

## Out of scope

A new analysis engine, a SAST platform or dashboard, a rule editor, runtime
protection, automated fixing, other languages, and any claim to *prove* that
authorization is correct.

## Current state

See the [rule catalogue](../README.md#rule-catalogue) and the
[milestone logs](milestones/README.md).

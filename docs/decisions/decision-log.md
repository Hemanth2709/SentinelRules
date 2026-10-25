# Decision log

### DEC-001: Use Semgrep as the rule engine

- **Status:** Accepted
- **Date:** 2026-10-25
- **Context:** The project requires custom static-analysis rules for
  JavaScript and TypeScript.
- **Decision:** Use Semgrep's YAML rule format and its built-in `--test`
  runner.
- **Alternatives considered:** ESLint plugins (would require writing
  JavaScript visitor code per rule and a separate test harness); CodeQL
  (stronger dataflow but heavier setup and query language).
- **Reason:** The project demonstrates custom rule writing and validation
  without building an engine; Semgrep rules are readable by reviewers who do
  not write code.
- **Consequences:** Analysis is mostly single-file and syntactic; dataflow
  across files is out of reach, which shapes every rule's limitations.
- **Related:** all rules.

### DEC-002: Pin Semgrep 1.180.0

- **Status:** Accepted
- **Date:** 2026-10-25
- **Context:** Rule semantics and the test runner change between Semgrep
  releases. Results need to be reproducible.
- **Decision:** Pin `semgrep==1.180.0` locally and in CI (`SEMGREP_VERSION`
  in the workflow).
- **Alternatives considered:** Latest version (1.182.1 was available) –
  reproducibility suffers; the official Docker image – adds a container
  dependency for a simple pip install.
- **Reason:** A recent release that is not the newest, installed the same
  way everywhere.
- **Consequences:** Upgrades are deliberate: bump the version, re-run all
  tests, and record the result.
- **Related:** Milestone 1, CI.

### DEC-003: Keep rules and fixtures in separate directories; run `semgrep --test --config rules/ tests/`

- **Status:** Accepted
- **Date:** 2026-10-25
- **Context:** The planned layout puts rules in `rules/` and fixtures in
  `tests/`. The planned command `semgrep --test rules/` looks for fixtures
  next to the rules; with this layout it reported `No unit tests found` and
  exited with status 0 – a silent pass.
- **Decision:** Keep the planned layout and run
  `semgrep --test --config rules/ tests/`. CI also fails if the output
  contains `No unit tests found`.
- **Alternatives considered:** Moving fixtures into `rules/` (works with the
  short command, but mixes rule definitions with test code and departs from
  the planned structure).
- **Reason:** Preserves the documented structure and removes the false-green
  risk.
- **Consequences:** Documentation uses the two-directory command throughout.
- **Related:** all rules, CI.

### DEC-007: Run fixture tests one rule file at a time

- **Status:** Accepted
- **Date:** 2026-10-25
- **Context:** On Windows (Git Bash, Python 3.14, Semgrep 1.180.0),
  `semgrep --test --config rules/ tests/` raised
  `PermissionError: ... .semgrep\settings.yml` for three rule files and still
  printed "All tests passed" for the other six rule IDs. Semgrep rewrites its
  settings file on every start, and the test runner checks rule files
  concurrently. `check-examples.sh` also called `python3`, which Git Bash on
  Windows usually lacks.
- **Decision:** Add `scripts/run-tests.sh`, which runs each rule file in its
  own Semgrep process with a private `SEMGREP_SETTINGS_FILE`, and fails on
  any failed annotation, missing fixture, Semgrep error, or empty test run.
  Use it in CI and the docs. Make both scripts use `python3` or `python`.
- **Alternatives considered:** Telling Windows users to use Docker or WSL
  (still documented, but the default command should work); keeping the
  single-call command in CI (it is fine on Linux, but the local and CI
  commands would differ).
- **Consequences:** Slightly slower (one Semgrep start per rule file).
  Verified on Linux (locally and in CI) and on the maintainer's Windows
  machine (Git Bash, Python 3.14, Semgrep 1.180.0): all 8 rule files passed
  with no `PermissionError`, and `check-examples.sh` passed using `python`.
- **Related:** DEC-003, CI.

### DEC-004: One rule file per feature; multiple rule IDs allowed

- **Status:** Accepted
- **Date:** 2026-10-25
- **Context:** Some features contain checks with different confidence (JWT:
  `ignoreExpiration` vs missing algorithms) or different frameworks
  (authorization: NestJS vs Next.js).
- **Decision:** Keep one YAML file per feature, matching the planned layout,
  but allow several rule IDs within it, each with its own severity and
  confidence.
- **Reason:** Severity and confidence are per finding; merging different
  confidence levels under one ID would misreport one of them.
- **Consequences:** The pack has 8 features and 10 rule IDs.
- **Related:** Rules 02 and 08.

### DEC-005: Favour precision for audit-style rules

- **Status:** Accepted
- **Date:** 2026-10-25
- **Context:** Several rules (public secrets, cookies, authorization) could
  be made broader at the cost of many low-value findings.
- **Decision:** Prefer narrower matching with documented false negatives:
  only unambiguous secret words; only session-like cookie names; only
  mutating Next.js handlers; options passed as variables or spreads are not
  judged.
- **Reason:** Noisy rules are disabled by developers; documented gaps can be
  covered by review or other tools.
- **Consequences:** Each feature's `limitations.md` lists what is
  deliberately excluded.
- **Related:** Rules 02, 03, 04, 06, 08.

### DEC-006: Check examples per rule in CI

- **Status:** Accepted
- **Date:** 2026-10-25
- **Context:** Realistic examples in `examples/` should demonstrate each
  rule. Running the whole pack over them showed the authorization rule
  flagging the login routes in the cookie examples.
- **Decision:** `scripts/check-examples.sh` checks each example only against
  its own rule: at least one finding for the vulnerable example, none for the
  secure example.
- **Reason:** Examples are written to illustrate one weakness; cross-rule
  findings are expected and documented rather than suppressed.
- **Consequences:** The observed cross-rule false positive is recorded in
  Rule 08's limitations.
- **Related:** Rules 06 and 08, CI.

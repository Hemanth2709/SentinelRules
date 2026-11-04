# CI/CD guide

Two workflows:

- [`.github/workflows/semgrep-tests.yml`](../.github/workflows/semgrep-tests.yml):
  validates and tests the rule pack (sections below).
- [`.github/workflows/code-scanning.yml`](../.github/workflows/code-scanning.yml):
  uploads findings for `examples/vulnerable` to GitHub code scanning and
  self-tests the reusable action (see [Code scanning](#code-scanning)).

## Triggers

`push` (all branches), `pull_request`, and manual `workflow_dispatch`.

## Steps

1. Check out the repository.
2. Set up Python 3.12.
3. Install `semgrep==${SEMGREP_VERSION}` (currently 1.180.0).
4. `semgrep --validate --config rules/`.
5. `scripts/run-tests.sh`: fixture tests one rule file at a time, failing on a
   failed annotation, a missing fixture, a Semgrep error, or
   `No unit tests found`.
6. `scripts/check-examples.sh`.
7. Write a summary of test and example results to the job summary
   (always runs, so failures are visible too).

Each step fails the job on a non-zero exit. Steps that pipe into `tee` use
`set -o pipefail`, because GitHub's default `run` shell does not.

## Permissions

`semgrep-tests.yml` uses `permissions: contents: read`. It does not publish
packages, upload results, or deploy anything. Only the `sarif` job in
`code-scanning.yml` has `security-events: write`, which it needs to upload
SARIF.

## Scanning another application

The repository is also a composite GitHub Action ([`action.yml`](../action.yml)).
It installs pinned Semgrep, scans with this pack, writes SARIF, and fails the
step at the threshold you choose:

```yaml
jobs:
  sentinel-rules:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write   # only needed with upload-sarif: "true"
    steps:
      - uses: actions/checkout@v5
      - uses: Hemanth2709/SentinelRules@<release tag or commit SHA>
        with:
          path: .                # what to scan
          fail-on: error         # error | warning | none
          upload-sarif: "true"   # show findings in the Security tab and on PRs
```

| Input | Default | Meaning |
|---|---|---|
| `path` | `.` | Directory or file to scan |
| `fail-on` | `error` | Fail on ERROR findings (`error`), on ERROR or WARNING (`warning`), or never (`none`) |
| `sarif-file` | `sentinel-rules.sarif` | Where the SARIF report is written |
| `upload-sarif` | `false` | Upload the report to GitHub code scanning |
| `category` | `sentinel-rules` | Code scanning category, to keep this analysis separate from others |
| `semgrep-version` | `1.180.0` | Semgrep version to install |

Pin a release tag or a full commit SHA so rule changes never alter your CI
unexpectedly. The upload still runs when the threshold fails, so findings
reach the Security tab either way.

Without the action, the same scan is two commands:

```yaml
- uses: actions/checkout@v5
- uses: actions/checkout@v5
  with:
    repository: Hemanth2709/SentinelRules
    ref: v0.1.1          # pin a release so rule changes don't alter your CI unexpectedly
    path: sentinel-rules
- run: pip install semgrep==1.180.0
- run: semgrep scan --metrics=off --config sentinel-rules/rules --exclude sentinel-rules --error .
```

`--error` makes the job fail when there are findings; omit it to report
without blocking.

## Code scanning

`code-scanning.yml` runs on pushes to `main`, on pull requests from this
repository, and manually. It scans `examples/vulnerable` with the local
action and uploads the SARIF report under the category
`sentinel-rules-examples`, so the alerts appear under **Security → Code
scanning** and inline on pull requests. Every alert there is deliberate: the
vulnerable examples exist to be flagged.

[`scripts/sarif-postprocess.py`](../scripts/sarif-postprocess.py) prepares the
report before upload:

- strips the config-path prefix from rule IDs (`rules.sentinel-…` becomes
  `sentinel-…`), so alert IDs stay stable wherever the pack is installed;
- adds GitHub's `security-severity` property from the rule's own level:
  ERROR → 7.5 (High), WARNING → 5.0 (Medium) ([DEC-009](decisions/decision-log.md));
- applies the `fail-on` threshold and prints a one-line summary.

The `action-self-test` job checks the threshold: scanning
`examples/vulnerable` with `fail-on: error` must fail, and scanning
`examples/secure` with `fail-on: error` must pass. (The secure examples have
one WARNING-level finding, the public login route, recorded in Rule 08's
limitations.)

## Evidence

CI run links are recorded in the milestone logs once the workflow has run on
GitHub.

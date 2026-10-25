# CI/CD guide

Workflow: [`.github/workflows/semgrep-tests.yml`](../.github/workflows/semgrep-tests.yml)

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

The workflow uses `permissions: contents: read`. It does not publish
packages, upload results, or deploy anything.

## Scanning another application

Rule testing is kept separate from application scanning. To run the pack in
another repository's CI:

```yaml
- uses: actions/checkout@v4
- uses: actions/checkout@v4
  with:
    repository: <owner>/SentinelRules
    path: sentinel-rules
- run: pip install semgrep==1.180.0
- run: semgrep scan --metrics=off --config sentinel-rules/rules --error .
```

`--error` makes the job fail when there are findings; omit it to report
without blocking.

## Evidence

CI run links are recorded in the milestone logs once the workflow has run on
GitHub.

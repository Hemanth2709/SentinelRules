#!/usr/bin/env bash
# Runs the Semgrep fixture tests one rule file at a time.
#
# `semgrep --test --config rules/ tests/` checks several rule files at once.
# Every check rewrites Semgrep's settings file, and on Windows those
# overlapping writes fail with "PermissionError: ... .semgrep\settings.yml",
# so some rule files are silently left untested. Running each rule file in
# its own process, with a private settings file, avoids that on every
# platform.
#
# Usage: scripts/run-tests.sh
set -euo pipefail

cd "$(dirname "$0")/.."

settings_dir="$(mktemp -d)"
trap 'rm -rf "$settings_dir"' EXIT
export SEMGREP_SETTINGS_FILE="$settings_dir/settings.yml"
export PYTHONUTF8=1

status=0
files=0
for rule in rules/*.yml; do
  name="$(basename "$rule" .yml)"
  fixture="$(ls tests/"$name".ts tests/"$name".tsx 2>/dev/null | head -n 1 || true)"
  if [[ -z "$fixture" ]]; then
    echo "MISSING  no fixture for $rule"
    status=1
    continue
  fi
  files=$((files + 1))

  if output="$(semgrep --metrics=off --test --config "$rule" "$fixture" 2>&1)"; then
    result=0
  else
    result=$?
  fi

  summary="$(grep -E "tests? (did not )?pass" <<<"$output" | tail -n 1 || true)"
  if [[ "$result" -ne 0 ]] || grep -qE "No unit tests found|Traceback|produced errors" <<<"$output"; then
    echo "FAIL     $rule  ${summary:-(no summary)}"
    grep -E "✖|missed lines|incorrect lines|Error" <<<"$output" | sed 's/^/           /' || true
    status=1
  else
    echo "PASS     $rule  $summary"
  fi
done

echo
if [[ "$status" -eq 0 ]]; then
  echo "All $files rule files passed."
else
  echo "Some rule files failed."
fi
exit "$status"

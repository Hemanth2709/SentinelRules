#!/usr/bin/env bash
# Checks that every rule fires on its vulnerable example and stays silent on
# its secure example. Each example is checked only against its own rule file,
# because a file may legitimately trigger other rules in the pack.
#
# Usage: scripts/check-examples.sh
set -euo pipefail

cd "$(dirname "$0")/.."

status=0
for rule in rules/*.yml; do
  name="$(basename "$rule" .yml)"
  for kind in vulnerable secure; do
    example="$(ls examples/"$kind"/"$name".ts examples/"$kind"/"$name".tsx 2>/dev/null | head -n 1 || true)"
    if [[ -z "$example" ]]; then
      echo "MISSING  $kind example for $name"
      status=1
      continue
    fi
    count="$(semgrep scan --metrics=off --quiet --config "$rule" "$example" --json \
      | python3 -c 'import json, sys; print(len(json.load(sys.stdin)["results"]))')"
    if [[ "$kind" == "vulnerable" && "$count" -eq 0 ]]; then
      echo "FAIL     $example: expected at least one finding, got 0"
      status=1
    elif [[ "$kind" == "secure" && "$count" -ne 0 ]]; then
      echo "FAIL     $example: expected no findings, got $count"
      status=1
    else
      echo "PASS     $example ($count finding(s))"
    fi
  done
done

exit "$status"

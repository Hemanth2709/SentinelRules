#!/usr/bin/env python3
"""Prepare a Semgrep SARIF file for GitHub code scanning.

Usage: sarif-postprocess.py <sarif-file> [--fail-on error|warning|none]

1. Rule IDs: Semgrep prefixes rule IDs with the config path when the rules
   are loaded from a directory (``rules.sentinel-...``). Strip everything
   before ``sentinel-`` so alerts keep the same ID wherever the pack lives.
2. Severity: GitHub ranks security alerts by the ``security-severity``
   property (0.0-10.0), which Semgrep does not emit. Map the rule's own
   severity onto GitHub's bands: ERROR -> 7.5 (High), WARNING -> 5.0
   (Medium), anything else -> 3.0 (Low). This mirrors the rule's level; it is
   not a CVSS score.
3. Names: the tool is reported as "Sentinel Rules" (Semgrep reports itself
   as "Semgrep OSS"), and each rule's short description uses the clean ID,
   so alerts in the Security tab name this pack rather than the engine.
4. Exit status: with ``--fail-on error`` the script exits 1 if any result
   is an ERROR-level finding; ``warning`` fails on ERROR or WARNING; ``none``
   never fails. Prints a one-line summary either way.

The file is rewritten in place. Standard library only.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

SECURITY_SEVERITY = {"error": "7.5", "warning": "5.0"}
DEFAULT_SECURITY_SEVERITY = "3.0"


def clean_id(rule_id: str) -> str:
    index = rule_id.find("sentinel-")
    return rule_id[index:] if index > 0 else rule_id


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("sarif", type=Path)
    parser.add_argument("--fail-on", choices=["error", "warning", "none"], default="none")
    args = parser.parse_args()

    data = json.loads(args.sarif.read_text(encoding="utf-8"))
    counts = {"error": 0, "warning": 0, "note": 0}

    for run in data.get("runs", []):
        levels: dict[str, str] = {}
        driver = run.get("tool", {}).get("driver", {})
        engine = f"{driver.get('name', 'Semgrep')} {driver.get('semanticVersion', '')}".strip()
        driver["name"] = "Sentinel Rules"
        driver["informationUri"] = "https://github.com/Hemanth2709/SentinelRules"
        driver.setdefault("properties", {})["engine"] = engine
        for rule in driver.get("rules", []):
            original = rule.get("id", "")
            rule["id"] = clean_id(original)
            if "name" in rule:
                rule["name"] = clean_id(rule["name"])
            rule["shortDescription"] = {"text": f"Sentinel Rules: {rule['id']}"}
            level = rule.get("defaultConfiguration", {}).get("level", "warning")
            levels[rule["id"]] = level
            properties = rule.setdefault("properties", {})
            properties["security-severity"] = SECURITY_SEVERITY.get(level, DEFAULT_SECURITY_SEVERITY)

        for result in run.get("results", []):
            if "ruleId" in result:
                result["ruleId"] = clean_id(result["ruleId"])
            level = result.get("level") or levels.get(result.get("ruleId", ""), "warning")
            counts[level if level in counts else "note"] += 1

    args.sarif.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")

    total = sum(counts.values())
    print(f"Sentinel Rules: {total} finding(s): {counts['error']} error, {counts['warning']} warning, {counts['note']} other")

    if args.fail_on == "error" and counts["error"]:
        print("Failing: ERROR-level findings present (fail-on: error).")
        return 1
    if args.fail_on == "warning" and (counts["error"] or counts["warning"]):
        print("Failing: ERROR or WARNING findings present (fail-on: warning).")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

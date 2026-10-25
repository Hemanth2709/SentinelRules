# Setup guide

## Requirements

- Python 3.9+ (Semgrep is distributed on PyPI)
- Git

## Install the pinned Semgrep version

The project is tested with **Semgrep 1.180.0** (the same version CI uses, see
`SEMGREP_VERSION` in `.github/workflows/semgrep-tests.yml`).

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install semgrep==1.180.0
semgrep --version   # 1.180.0
```

## Run the rule tests

```bash
semgrep --test --config rules/ tests/
scripts/check-examples.sh
```

## Scan an application

```bash
semgrep scan --metrics=off --config /path/to/SentinelRules/rules /path/to/app
```

Only scan code you own or have permission to scan.

Useful options:

- `--json` or `--sarif --output results.sarif` for machine-readable output.
- `--config rules/sql-injection.yml` to run a single rule file.
- `--severity ERROR` to show only high-severity rules.

## Suppressing a reviewed finding

```ts
// nosemgrep: sentinel-react-dangerously-set-inner-html -- HTML generated at build time from repository Markdown
```

Always include the reason.

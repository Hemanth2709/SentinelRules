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
scripts/run-tests.sh
scripts/check-examples.sh
```

## Windows (Git Bash)

Semgrep's native Windows support is in beta. Tested setup: Git Bash,
Python 3.14, `python -m pip install semgrep==1.180.0`.

- pip may install `semgrep` into a `Scripts` folder that is not on `PATH`
  (`bash: semgrep: command not found`). Add it, quoting paths with spaces:
  ```bash
  export PATH="$PATH:$(cygpath -u "$(python -c 'import sysconfig; print(sysconfig.get_path("scripts"))')")"
  ```
  For a `--user` install the folder is
  `%APPDATA%\Python\Python3XX\Scripts`.
- Set `export PYTHONUTF8=1` to avoid encoding errors.
- Use `/e/path/to/app`, not `E:\path\to\app`: Git Bash removes backslashes.
- Use `scripts/run-tests.sh`, not `semgrep --test --config rules/ tests/`
  (see [testing-guide.md](testing-guide.md#windows-permissionerror--semgrepsettingsyml)).

Docker (`semgrep/semgrep:1.180.0`) or WSL avoid these issues entirely.

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

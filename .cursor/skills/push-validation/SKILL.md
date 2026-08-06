---
name: push-validation
description: >-
  Validate the repo before git push using make push-validate / preflight.
  Use before pushing or when pre-push hooks fail.
---

# Push Validation

## Command

```bash
make push-validate
# equivalent: scripts/push_validate.sh
# equivalent: make preflight
```

Runs: lint → test → format-check → build → npm audit.

## On failure

1. Fix the reported error
2. Re-run `make push-validate`
3. Only then push

Do not suggest `--no-verify` unless the user explicitly requests bypassing hooks.

Husky `pre-push` invokes this script automatically.

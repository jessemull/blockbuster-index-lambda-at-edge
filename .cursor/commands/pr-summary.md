# PR summary

Generate a pull request title and body from the current branch diff.

## Gather

```bash
git fetch origin main
git log --oneline origin/main..HEAD
git diff origin/main...HEAD --stat
git diff origin/main...HEAD
```

## Output

Fill `.github/PULL_REQUEST_TEMPLATE.md` sections:

- Summary (what/why)
- Type checkboxes
- Checklist (honest about `make preflight`)
- Review notes (risks, CF/CloudFront follow-up)

Do not invent test results — run `make preflight` if unsure.

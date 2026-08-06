---
name: commit
description: >-
  Prepare Conventional Commits for this repo with husky/commitlint and
  lint-staged awareness. Use when staging or committing.
---

# Commit

Read `CONTEXT.md`, `docs/CONTRIBUTING.md`, and `docs/GOVERNANCE.md`.

## Rules

- Only commit when the user explicitly asks
- Never `--no-verify` unless the user explicitly requests it
- Never amend pushed commits; never force-push `main`
- Prefer atomic commits; body lines ≤ 100 chars (commitlint)

## Steps

1. `git status` / `git diff` / `git log -5 --oneline`
2. Ensure `make preflight` is green for code changes
3. Stage intentional files only (never `.env`)
4. Commit via HEREDOC message:

```bash
git commit -m "$(cat <<'EOF'
type: subject

Optional body wrapped under 100 chars per line.
EOF
)"
```

Types: `feat`, `fix`, `docs`, `chore`, `ci`, `refactor`, `test`, `style`.

Husky runs lint-staged + commitlint automatically.

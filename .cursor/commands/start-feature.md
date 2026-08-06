# Start feature branch

Branch name: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask for a branch name (e.g. `feat/canonical-redirect` or `fix/malformed-uri`).

## 1. Load governance

Read in order: `CONTEXT.md`, `AGENTS.md`, `docs/GOVERNANCE.md`, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/SECURITY.md`, `docs/CI_CD.md`.

Complete the confirmation checklist in `CONTEXT.md`.

## 2. Sync and branch

```bash
git fetch origin main
git checkout main
git pull origin main
git checkout -b $ARGUMENTS
```

## 3. Implement

Follow `.cursor/skills/feature-development/SKILL.md`. Run `make preflight` before requesting a commit.

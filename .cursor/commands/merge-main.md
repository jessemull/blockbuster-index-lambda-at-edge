# Merge latest main

## 1. Fetch and inspect

```bash
git fetch origin main
git status -sb
git log --oneline HEAD..origin/main
```

## 2. Integrate

Prefer rebase for simple feature branches (only if the user allows rebase):

```bash
git rebase origin/main
```

Otherwise:

```bash
git merge origin/main
```

## 3. Validate

```bash
make push-validate
```

Resolve conflicts carefully; re-read `docs/ARCHITECTURE.md` if handler/CF conflicted.

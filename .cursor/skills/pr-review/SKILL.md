---
name: pr-review
description: >-
  Review pull requests for this Lambda@Edge repo: diff-first, code-only,
  fixed-section task lists. Use when reviewing a PR/branch or merge blockers.
---

# PR Review

**Severity definitions:** `docs/REVIEW.md`.

**Governance:** skim `CONTEXT.md` + `AGENTS.md`; load other docs when the diff touches that domain.

## Principles

1. Diff-first
2. Risk-scoped depth
3. One bullet = one fixable task
4. Checklists are internal — never paste `docs/REVIEW.md` tables into output
5. Fixed sections always; use `(no items)` when empty
6. No hedging in MUST/SHOULD/NICE bullets

## Step 1 — Gather context

```bash
git fetch origin main
git log --oneline origin/main..HEAD
git diff origin/main...HEAD --stat
git diff origin/main...HEAD
```

## Step 2 — Review

Apply relevant sections of `docs/REVIEW.md` (handler, infra, tests, security, §0 automation).

## Step 3 — Output format

```markdown
## Scope

…

## Risk

Low | Medium | High — …

## Architecture

OK | concern — …

## Files changed

| File | Purpose |
| ---- | ------- |
| …    | …       |

## Strengths

- …

## MUST

- `path` — Imperative fix
  (or `(no items)`)

## SHOULD

- …

## NICE TO HAVE

- …

## Test plan

- `make preflight`
- …
```

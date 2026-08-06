---
name: repo-review
description: >-
  Full-repository quality audit for the Lambda@Edge project (not just a PR
  diff). Use when asked for a thorough repo review or health check.
---

# Repo Review

Read `CONTEXT.md`, `AGENTS.md`, and `docs/REVIEW.md`.

## Scope

Audit:

- Handler correctness and Edge constraints (`src/`)
- Tests and coverage config
- CloudFormation templates (runtime, IAM, S3)
- CI workflows (Node 24 actions, gates)
- Secrets hygiene (`.gitignore`, `.env.example`)
- Governance docs freshness vs reality

## Output

Same severity sections as `pr-review` (MUST / SHOULD / NICE TO HAVE), plus:

```markdown
## Verdict

Ready | Needs work — one paragraph

## Top risks

- …
```

Run `make preflight` and include whether it passed.

---
name: dependency-upgrade
description: >-
  Upgrade npm devDependencies safely for this repo, respecting TypeScript
  and Jest peer constraints. Use for outdated packages or npm audit fixes.
---

# Dependency Upgrade

Read `docs/DEPENDENCIES.md`.

## Steps

1. `npm outdated` and `npm audit`
2. Prefer lockfile-compatible bumps within existing majors first
3. For majors: note breaking changes; **human review** required
4. Keep `typescript` on 5.9.x until eslint/ts-jest support 7+
5. Keep `@types/node` on `^24` to match runtime/CI
6. `npm install` → `make preflight`
7. Summarize upgrades in the PR

Do not add production `dependencies` without human approval (Edge bundle).

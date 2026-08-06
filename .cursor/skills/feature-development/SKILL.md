---
name: feature-development
description: >-
  End-to-end workflow for implementing a small feature or fix in this
  Lambda@Edge repository.
---

# Feature Development

1. Read `CONTEXT.md` mandatory order; complete the confirmation checklist
2. Confirm autonomy vs human-review (`docs/GOVERNANCE.md`)
3. Branch: `feat/…` or `fix/…` from updated `main`
4. Implement minimal change in `src/` (+ tests)
5. Update docs if architecture/deploy/governance behavior changed
6. `make preflight`
7. Commit only if the user asks; open PR with the template

## Edge feature checklist

- [ ] Tests for new branches
- [ ] No network/SDK in handler
- [ ] Querystring / host / URI edge cases considered

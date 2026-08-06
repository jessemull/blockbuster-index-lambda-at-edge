# PR Review Framework

> **Precedence:** CONTEXT.md > GOVERNANCE.md > ARCHITECTURE.md > **REVIEW.md** > inline comments.
>
> **AI agents — read this file when:** reviewing a PR, writing review comments, or deciding merge blockers.

---

## Severity tiers

### MUST (blocking)

- Security issues (secrets in source, IAM overly broad, public S3)
- Incorrect Edge behavior (broken redirects, `/.html`, uncaught `decodeURIComponent`)
- Handler network/SDK usage or bundle bloat
- Coverage drop below thresholds / failing tests
- Governance violations (CF/IAM/workflow without human review path)
- TypeScript/lint failures

### SHOULD (significant)

- Missing tests for new branches
- Unclear error handling or missing edge cases
- Docs not updated for architecture/deploy changes
- Dependency major bumps without notes

### NICE TO HAVE (non-blocking)

- Naming / readability polish
- Extra comments
- Minor refactors equivalent in behavior

---

## §0 Pre-merge automation (Nextdoor-style)

Before approve/merge, these MUST be green:

```bash
make preflight
```

CI on the PR runs the same `make preflight` job (plus package). Merge/deploy workflows also run `make preflight` before shipping.

---

## PR hygiene

- [ ] Focused single logical change
- [ ] Conventional Commits
- [ ] Template filled (What / Why / How / Testing)
- [ ] No unrelated files
- [ ] Secrets not introduced

---

## Handler / Edge checklist

- [ ] Apex redirect only for `blockbusterindex.com` (case-insensitive), always HTTPS www
- [ ] Query string preserved via `request.querystring`
- [ ] Malformed percent-encoding does not throw
- [ ] Paths normalizing to `/` become `/index.html` (or `/` on redirect), never `/.html`
- [ ] Extensionless paths get `.html`; files with extensions unchanged
- [ ] No AWS SDK / fetch / fs in handler

---

## Infrastructure checklist

- [ ] Runtime remains `nodejs24.x` unless intentionally upgraded with review
- [ ] IAM least privilege; logs scoped; S3 encryption + public access block
- [ ] Exports/import names unchanged unless migration planned
- [ ] Workflows use Node 24-compatible actions

---

## Testing checklist

- [ ] New behavior covered
- [ ] Mocks use separate `uri` / `querystring`
- [ ] Coverage thresholds still pass

---

## Review output contract (for agent skills)

Use fixed sections: Scope, Risk, Architecture, Files changed, Strengths, MUST, SHOULD, NICE TO HAVE, Test plan.  
Use `(no items)` when empty. One imperative bullet per finding with `` `file` `` references. Never paste this checklist into the review.

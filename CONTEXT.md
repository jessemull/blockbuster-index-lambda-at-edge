# CONTEXT.md — Blockbuster Index Lambda@Edge

> **This is the PRIMARY entry point for ALL AI agents working in this repository.**
> Read this file first. Follow the mandatory reading order below before making any changes.

---

## Mandatory Reading Order

Every agent MUST read the following documents **in order** before making any change:

1. **`CONTEXT.md`** (this file) — loading order, precedence, non-negotiables, quality gates
2. **`AGENTS.md`** — development rules, architecture constraints, coding standards
3. **`docs/GOVERNANCE.md`** — contribution workflow, review policy, human escalation
4. **`docs/ARCHITECTURE.md`** — handler flow, webpack packaging, CloudFormation stacks
5. **`docs/TESTING.md`** — Jest strategy, coverage, CloudFront event mocks
6. **`docs/SECURITY.md`** — secrets, IAM, S3 hardening
7. **`docs/CI_CD.md`** — GitHub Actions, deploy/rollback pipelines

Read items 5–7 on every task. Do not skip them because the work “seems unrelated.”

Load on demand when the task touches that domain:

- `docs/REVIEW.md` — PR/repo review
- `docs/DEPLOYMENT.md` — S3 artifacts, CloudFront association
- `docs/DEPENDENCIES.md` — dependency upgrades
- `docs/COMMENTS.md` — comment spacing
- `docs/CONTRIBUTING.md` — branch/PR workflow
- `docs/RELEASES.md` — artifact versioning and rollback

---

## Source-of-Truth Precedence

When instructions conflict, the **higher-ranked source wins**:

| Priority    | Source                                                 | Scope                                         |
| ----------- | ------------------------------------------------------ | --------------------------------------------- |
| 1 (highest) | `CONTEXT.md`                                           | Repository-wide constraints and quality gates |
| 2           | `docs/GOVERNANCE.md`                                   | Contribution workflow and review policy       |
| 3           | `docs/ARCHITECTURE.md`                                 | System design and boundaries                  |
| 4           | Feature / domain docs (`TESTING.md`, `SECURITY.md`, …) | Domain-specific rules                         |
| 5 (lowest)  | Inline code comments                                   | Local implementation notes                    |

**Lower-precedence instructions MUST NOT contradict higher-precedence instructions.** If a conflict is detected, flag it for human review and follow the higher-precedence source.

---

## Non-Negotiable Constraints

These apply to **every change**. No exceptions without explicit human approval.

### Secrets and environment

- **No hardcoded secrets.** Bastion SSH config and AWS credentials live in `.env` (gitignored) or GitHub Actions secrets.
- **Update `.env.example`** whenever a new env var is introduced.
- Never commit `.env`, private keys, or access tokens.

### Lambda@Edge handler

- **Viewer-request purity:** the handler must not call the network, AWS SDKs, or filesystem at runtime. Keep the cold path CPU-only.
- **Bundle size:** webpack output must stay well under the Lambda@Edge package limit (target ≪ 1MB; current bundle is ~1.5KB).
- **Runtime:** CloudFormation uses `nodejs24.x`. CI builds with Node 24. Do not regress to Node 20.
- **Canonical redirects:** apex `blockbusterindex.com` → `https://www.blockbusterindex.com` (always HTTPS).
- **Malformed URIs:** never throw from `decodeURIComponent`; return the request unchanged.

### Infrastructure and CI

- Changes to CloudFormation templates, IAM, GitHub workflows, or coverage thresholds **require human review**.
- Do not weaken Jest `coverageThreshold` (global ≥ 80% for branches/functions/lines/statements).

### Git and commits

- Conventional Commits enforced by commitlint + husky.
- Never use `--no-verify` unless the user explicitly requests it.
- Never force-push `main`.

---

## Mandatory Quality Gates

| When        | Gate                                                                 | Failure policy |
| ----------- | -------------------------------------------------------------------- | -------------- |
| **Commit**  | husky pre-commit → `lint-staged` (eslint + prettier on staged files) | Block commit   |
| **Push**    | husky pre-push → `scripts/push_validate.sh` (`make push-validate`)   | Block push     |
| **PR / CI** | `make preflight` (+ package on PR/merge/deploy)                      | Block merge\*  |
| **Deploy**  | `make preflight` before S3/CloudFormation                            | Block deploy   |

\*Requires GitHub branch protection with the **Preflight** check required — see `docs/CI_CD.md`.

### Preferred agent commands

```bash
make preflight      # lint + test + format-check + build + audit
make push-validate  # same gates before push
make lint && make test && make build
```

Do **not** skip gates because a change “is docs only” if scripts still run — docs-only PRs may omit build if unchanged, but prefer full preflight.

---

## Confirmation Checklist

Before implementing, confirm:

- [ ] Read `CONTEXT.md` and `AGENTS.md`
- [ ] Read `docs/GOVERNANCE.md` and `docs/ARCHITECTURE.md`
- [ ] Read `docs/TESTING.md`, `docs/SECURITY.md`, and `docs/CI_CD.md`
- [ ] Know whether the change is autonomous or requires human review (see GOVERNANCE)
- [ ] Will run `make preflight` before asking to commit/push

# Governance

> **Precedence:** CONTEXT.md > **GOVERNANCE.md** > ARCHITECTURE.md > feature docs > inline comments.
>
> **AI agents — read this file when:** making structural decisions, resolving conflicting guidance, determining what requires human review, or changing governance docs.

---

## Source-of-truth precedence

| Rank | Document                                     | Scope                             |
| ---- | -------------------------------------------- | --------------------------------- |
| 1    | `CONTEXT.md`                                 | Constraints and quality gates     |
| 2    | `GOVERNANCE.md`                              | Process, authority, enforcement   |
| 3    | `ARCHITECTURE.md`                            | Handler and infrastructure design |
| 4    | Domain docs (`TESTING.md`, `SECURITY.md`, …) | Domain rules                      |
| 5    | Inline comments                              | Local intent                      |

Resolve conflicts upward, never downward.

---

## Decision authority

### Autonomous (agents/developers may proceed)

- Bug fixes that do not change CloudFront contract or public redirect behavior unexpectedly
- Adding/updating unit tests
- Documentation polish within existing files
- Formatting and lint fixes
- Internal refactors that keep the handler API and CF exports stable

### Requires human review (PR approval mandatory)

- CloudFormation / IAM / S3 template changes
- GitHub Actions workflow changes
- New third-party dependencies or major version bumps
- Security-sensitive changes (secrets handling, IAM broadening)
- Coverage threshold changes or removing tests
- Changes to `CONTEXT.md`, `AGENTS.md`, or any `docs/` governance file
- Lambda runtime version changes
- Anything that alters apex→www redirect or URI rewrite semantics in production

### Product / ops decision (human only)

- Attaching or changing CloudFront Lambda@Edge triggers
- Production deploy via workflow_dispatch
- Bastion / network access changes
- DNS or certificate changes (owned outside this repo)

---

## Exception process

1. Document why a non-negotiable cannot be met.
2. Open a PR labeled as governance/exception with explicit risk.
3. Do not merge until a human approves.

---

## Enforcement

| Layer        | Mechanism                                                                  |
| ------------ | -------------------------------------------------------------------------- |
| Local commit | husky + lint-staged + commitlint                                           |
| Local push   | `scripts/push_validate.sh` (`make preflight`)                              |
| CI           | PR/merge/deploy: `make preflight` (+ package); require **Preflight** check |
| Review       | `docs/REVIEW.md` severity tiers + `.cursor/skills/pr-review`               |

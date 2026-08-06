# Contributing

> **Precedence:** CONTEXT.md > GOVERNANCE.md > **CONTRIBUTING.md**.
>
> **AI agents — read this file when:** starting a branch, opening a PR, or committing.

---

## Setup

```bash
git clone https://github.com/jessemull/blockbuster-index-lambda-at-edge.git
cd blockbuster-index-lambda-at-edge
npm install
cp .env.example .env   # if using bastion
```

Agents: read `CONTEXT.md` then `AGENTS.md` before coding.

---

## Branch naming

Use Conventional Commit-style prefixes:

- `feat/…`, `fix/…`, `chore/…`, `docs/…`, `ci/…`, `refactor/…`

---

## Commits

```bash
npm run commit   # Commitizen
# or hand-write Conventional Commits (commitlint enforced)
```

Husky blocks commits that fail lint-staged or commitlint. Do not use `--no-verify` unless explicitly requested by the user.

---

## Before push

```bash
make push-validate
# or: make preflight
```

Pre-push husky runs the same validation.

---

## Pull requests

1. Use `.github/PULL_REQUEST_TEMPLATE.md`
2. Ensure CI is green
3. Request review for changes listed in `docs/GOVERNANCE.md` as human-required
4. Keep PRs focused

---

## Quality commands

See `AGENTS.md` Make targets or run `make preflight`.

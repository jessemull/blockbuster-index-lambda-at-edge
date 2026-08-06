# AGENTS.md — Blockbuster Index Lambda@Edge

> Authoritative development rules for humans and AI agents.
> Precedence: `CONTEXT.md` > `docs/GOVERNANCE.md` > `docs/ARCHITECTURE.md` > this file’s coding standards > inline comments.
> Read `CONTEXT.md` first.

---

## Project map

| Path                                         | Purpose                                                    |
| -------------------------------------------- | ---------------------------------------------------------- |
| `src/index.ts`                               | CloudFront viewer-request handler (redirect + URI rewrite) |
| `src/index.test.ts`                          | Jest unit tests                                            |
| `template.yaml`                              | Lambda function + version CloudFormation stack             |
| `blockbuster-index-lambda-at-edge-role.yaml` | IAM execution role stack                                   |
| `blockbuster-index-lambda-at-edge-s3.yaml`   | Deployment artifact bucket stack                           |
| `webpack.config.js`                          | Bundle to `dist/index.js` (CommonJS)                       |
| `.github/workflows/`                         | PR, merge (dev deploy), deploy, rollback                   |
| `scripts/connect.js`                         | Bastion SSH helper (`npm run bastion`)                     |
| `docs/`                                      | Governance and domain documentation                        |
| `.cursor/`                                   | Cursor rules, skills, commands                             |

**Related product repos:** client site (`blockbuster-index`), MCP server — this repo only owns Edge routing.

---

## Make / npm command surface

Prefer **Make** as the agent front door (mirrors CI):

| Target                              | Action                                     |
| ----------------------------------- | ------------------------------------------ |
| `make lint`                         | ESLint                                     |
| `make test`                         | Jest + coverage                            |
| `make format` / `make format-check` | Prettier                                   |
| `make build`                        | webpack → `dist/`                          |
| `make package`                      | zip `dist/`                                |
| `make security`                     | `npm audit`                                |
| `make preflight`                    | lint + test + format-check + build + audit |
| `make push-validate`                | same as preflight (pre-push hook)          |

Equivalent npm scripts exist in `package.json` (`lint`, `test`, `format`, `format:check`, `build`, `package`, `bastion`, `commit`).

---

## Handler rules

1. Export `handler` as `async (event) => CloudFrontRequestResult`.
2. Use CloudFront’s separate `uri` and `querystring` fields — do not parse `?` out of `uri`.
3. Normalize paths with the in-repo URL normalizer (not Node `path.normalize`).
4. Append `.html` only when the path has no file extension and is not `/` (root → `/index.html`).
5. Preserve `querystring` on redirects via `request.querystring`.
6. Host matching is case-insensitive; redirects always use `https://www.blockbusterindex.com`.
7. Keep logic synchronous-CPU; no `fetch`, AWS SDK, or dynamic `import()` of large libs.

---

## TypeScript / style

- `strict: true` TypeScript.
- Prefer clear, small functions over clever one-liners.
- Match existing formatting; Prettier + ESLint are authoritative.
- Alphabetize named imports and object keys when practical.
- Comment spacing: see `docs/COMMENTS.md`.

---

## Testing rules

- Every behavior change needs a Jest test (happy path + at least one edge/failure).
- Mock `CloudFrontRequestEvent` with `uri`, `querystring`, and `headers` as CloudFront does.
- Do not drop below 80% coverage thresholds in `jest.config.js`.
- See `docs/TESTING.md`.

---

## Forbidden patterns

- Hardcoded secrets, IPs in committed source (use `.env.example` placeholders only)
- Adding Cognito/auth or network calls to the Edge handler without human approval
- Committing `dist/`, `coverage/`, or `.env`
- Skipping husky with `--no-verify` unless the user explicitly requests it
- Weakening CI gates or coverage thresholds without human review
- Duplicating project copies under nested directories (historical `cloudformation/` mistake)

---

## PR requirements

- Focused change; Conventional Commit history
- `make preflight` green
- Tests for behavior changes
- Update docs when architecture, deploy, or governance changes
- Use `.github/PULL_REQUEST_TEMPLATE.md`
- Human review required for: CF/IAM, workflows, deps majors, security, governance docs (see `docs/GOVERNANCE.md`)

---

## AI do / don’t

**Do:** read CONTEXT first; run quality gates; keep PRs small; escalate infrastructure/security.

**Don’t:** invent product requirements; attach CloudFront triggers via speculative AWS CLI without user ask; expand scope into the Next.js client repo.

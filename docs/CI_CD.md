# CI / CD

> **Precedence:** CONTEXT.md > GOVERNANCE.md > **CI_CD.md**.
>
> **AI agents — read this file when:** changing GitHub Actions or deploy automation.

---

## Workflows

| Workflow           | Trigger             | Purpose                                                          |
| ------------------ | ------------------- | ---------------------------------------------------------------- |
| `pull-request.yml` | PR → `main`         | `make preflight` + package                                       |
| `merge.yml`        | push → `main`       | `make preflight` + package + deploy to **dev**                   |
| `deploy.yml`       | `workflow_dispatch` | `make preflight` + package + deploy to **dev** or **prod**       |
| `rollback.yml`     | `workflow_dispatch` | redeploy prior S3 zip via change set (no preflight; intentional) |

All build jobs use **Node 24** (`actions/setup-node`) and Node 24-compatible action majors (`checkout@v6`, `upload-artifact@v6`, `configure-aws-credentials@v6`).

---

## Quality parity

Local, husky pre-push, and CI share the same gate:

```bash
make preflight
# lint → test → format:check → build → npm audit
```

PR / merge / deploy then run `npm run package` after preflight (build already produced `dist/`).

### Branch protection (required to block merges)

In GitHub repo settings → Branches → protect `main`:

- Require a pull request before merging
- Require status checks to pass: **Preflight**
- Optionally require CODEOWNERS review for infrastructure/governance paths

YAML alone does not block merge without these settings.

---

## Deploy mechanics (summary)

1. `make preflight` (lint, test, format, build, audit)
2. Zip `dist/` → upload versioned artifact to `s3://blockbuster-index-lambda-at-edge-{env}/…`
3. CloudFormation change set on `template.yaml` (us-east-1)
4. Prune S3 to latest 5 artifacts
5. **Manual:** associate new Lambda version with CloudFront

Details: `docs/DEPLOYMENT.md`.

---

## Changing workflows

Workflow edits require **human review** (`docs/GOVERNANCE.md`). Keep action runtimes on Node 24-compatible releases.

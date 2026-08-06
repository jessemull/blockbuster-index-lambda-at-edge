# CI / CD

> **Precedence:** CONTEXT.md > GOVERNANCE.md > **CI_CD.md**.
>
> **AI agents — read this file when:** changing GitHub Actions or deploy automation.

---

## Workflows

| Workflow           | Trigger             | Purpose                                        |
| ------------------ | ------------------- | ---------------------------------------------- |
| `pull-request.yml` | PR → `main`         | lint, test, format:check, build/package, audit |
| `merge.yml`        | push → `main`       | quality gates + deploy to **dev**              |
| `deploy.yml`       | `workflow_dispatch` | quality gates + deploy to **dev** or **prod**  |
| `rollback.yml`     | `workflow_dispatch` | redeploy prior S3 zip via change set           |

All build jobs use **Node 24** (`actions/setup-node`) and Node 24-compatible action majors (`checkout@v6`, `upload-artifact@v6`, `configure-aws-credentials@v6`).

---

## Quality parity

Local `make preflight` should match PR checks:

1. `npm run lint`
2. `npm test` (coverage thresholds)
3. `npm run format:check`
4. `npm run build`
5. `npm audit`

---

## Deploy mechanics (summary)

1. Webpack build + zip
2. Upload versioned artifact to `s3://blockbuster-index-lambda-at-edge-{env}/…`
3. CloudFormation change set on `template.yaml` (us-east-1)
4. Prune S3 to latest 5 artifacts
5. **Manual:** associate new Lambda version with CloudFront

Details: `docs/DEPLOYMENT.md`.

---

## Changing workflows

Workflow edits require **human review** (`docs/GOVERNANCE.md`). Keep action runtimes on Node 24-compatible releases.

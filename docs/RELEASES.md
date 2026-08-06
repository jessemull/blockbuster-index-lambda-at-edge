# Releases

> **Precedence:** CONTEXT.md > GOVERNANCE.md > **RELEASES.md**.
>
> **AI agents — read this file when:** versioning artifacts, deploying, or rolling back.

---

## Versioning

- `package.json` `version` is included in S3 artifact names.
- Each deploy uploads a **unique** zip: version + git SHA + UTC timestamp.
- CloudFormation publishes a new Lambda **version** resource on code changes.

---

## Retention

Deploy workflows prune the S3 prefix to the **latest 5** artifacts. Older zips are deleted — keep rollback targets within that window or copy elsewhere before prune.

---

## Promotion

| Environment | How                                              |
| ----------- | ------------------------------------------------ |
| dev         | Automatic on merge to `main`, or Deploy workflow |
| prod        | Deploy workflow (`workflow_dispatch`) only       |

After stack update, associate the new version with CloudFront manually.

---

## Rollback

1. List objects in the env bucket under `blockbuster-index-lambda-at-edge/`.
2. Run Rollback workflow with the chosen zip filename + environment.
3. Re-point CloudFront at the resulting version if needed.

See `docs/DEPLOYMENT.md` and `docs/CI_CD.md`.

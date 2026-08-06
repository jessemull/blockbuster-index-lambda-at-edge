# Deployment

> **Precedence:** CONTEXT.md > GOVERNANCE.md > ARCHITECTURE.md > **DEPLOYMENT.md**.
>
> **AI agents — read this file when:** deploying, rolling back, or changing packaging/CF.

---

## Prerequisites

- Supporting stacks deployed: S3 bucket (`*-s3.yaml`) and IAM role (`*-role.yaml`) with exports imported by `template.yaml`
- GitHub secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Region: **us-east-1** (Lambda@Edge requirement)

---

## Artifact naming

```
blockbuster-index-lambda-at-edge-{version}-{gitSha}-{timestamp}.zip
```

Uploaded under prefix `blockbuster-index-lambda-at-edge/` in the env bucket.

---

## Automated path

1. `npm run build` → `dist/index.js`
2. `npm run package` → zip in `dist/`
3. `aws s3 cp` to env bucket
4. Create/execute CloudFormation change set with `S3Key` + `Environment`
5. Monitor stack status (rollback statuses are **failures**)
6. Prune older zips (keep 5)

Triggers:

- Merge to `main` → **dev**
- Manual Deploy workflow → **dev** or **prod**

---

## Manual CloudFront step

CloudFormation publishes a Lambda **version**, but attaching that version as a CloudFront viewer-request trigger is done in the AWS console (or separate automation not in this repo). After deploy, update the distribution behavior to the new version ARN.

---

## Rollback

Use the Rollback workflow with:

- `environment`: `dev` | `prod`
- `s3_zip_file`: prior artifact filename in the bucket

Then re-associate CloudFront if the version ARN changed.

---

## Bastion

```bash
npm run bastion
```

Requires `.env` from `.env.example` (`SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY_PATH`).

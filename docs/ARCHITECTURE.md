# Architecture

> **Precedence:** CONTEXT.md > GOVERNANCE.md > **ARCHITECTURE.md** > domain docs > inline comments.
>
> **AI agents — read this file when:** changing the handler, webpack build, CloudFormation, or Edge request flow.

---

## Purpose

AWS Lambda@Edge (viewer-request) for the Blockbuster Index static site:

1. Redirect apex host `blockbusterindex.com` → `https://www.blockbusterindex.com` (301).
2. Rewrite extensionless paths to `.html` (and `/` → `/index.html`) for S3 static hosting.

---

## Request flow

```
CloudFront viewer-request
        │
        ▼
┌───────────────────────┐
│ host === apex?        │──yes──► 301 Location: https://www… + path + qs
└───────────┬───────────┘
            │ no
            ▼
┌───────────────────────┐
│ uri === "/" ?         │──yes──► uri = /index.html
└───────────┬───────────┘
            │ no
            ▼
┌───────────────────────┐
│ normalizeUri(uri)     │──fail─► return request unchanged
└───────────┬───────────┘
            │
            ▼
     append .html if no extension
            │
            ▼
     return modified request
```

CloudFront provides `uri` and `querystring` separately — never assume `?` is inside `uri`.

---

## Code layout

| Artifact            | Role                                                            |
| ------------------- | --------------------------------------------------------------- |
| `src/index.ts`      | Handler + `normalizeUri`                                        |
| `src/index.test.ts` | Unit tests                                                      |
| `webpack.config.js` | Node target, Terser, output `dist/index.js`                     |
| `template.yaml`     | `AWS::Lambda::Function` + `AWS::Lambda::Version` (`nodejs24.x`) |
| `*-role.yaml`       | IAM role for lambda + edgelambda                                |
| `*-s3.yaml`         | Versioned, encrypted, public-blocked deploy bucket              |

Cross-stack wiring uses `Fn::ImportValue` for role ARN and bucket name.

---

## Packaging constraints

- Lambda@Edge must be published in **us-east-1**.
- Zip must stay under Edge size limits; keep zero runtime dependencies.
- CloudFront **association of the published version** is manual (console) — not fully expressed in these templates.

---

## Environments

- **dev:** merge-to-main auto-deploy; site at `dev.blockbusterindex.com` (cookie-protected in the client project).
- **prod:** manual deploy workflow; public `www.blockbusterindex.com`.

See `docs/DEPLOYMENT.md` and `docs/CI_CD.md`.

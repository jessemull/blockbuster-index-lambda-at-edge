---
name: security-review
description: >-
  Security-focused review for Lambda@Edge, IAM, S3, secrets, and CI
  credentials. Use when asked for a security review or after infra changes.
---

# Security Review

Read `docs/SECURITY.md` and `docs/REVIEW.md` security-related MUST items.

## Checklist (internal)

- Secrets: no `.env` tracked; `.env.example` placeholders only
- Webpack does not load secrets into the bundle
- IAM least privilege; no unjustified `*`
- S3: encryption, public access block, versioning
- Workflows: credentials via secrets; least privilege keys
- Handler: no exfiltration paths / SSRF surface

## Output

Use MUST / SHOULD / NICE TO HAVE sections like `pr-review`, security-scoped.

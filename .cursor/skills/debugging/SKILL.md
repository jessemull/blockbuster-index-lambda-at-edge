---
name: debugging
description: >-
  Debug CloudFront / Lambda@Edge routing issues for this project (redirects,
  .html rewrites, 502s, cache). Use when investigating production or test faults.
---

# Debugging Lambda@Edge

## Common symptoms

| Symptom                   | Likely cause                                                                     |
| ------------------------- | -------------------------------------------------------------------------------- |
| Apex not redirecting      | Trigger not on viewer-request; wrong version associated; host header mismatch    |
| 502 from CloudFront       | Handler throw (e.g. decodeURIComponent); invalid response shape                  |
| Deep link 404             | Missing `.html` rewrite; wrong S3 key case; normalize lowercasing vs object keys |
| Old behavior after deploy | CloudFront still on previous Lambda version; cache                               |
| Dev site 403              | Expected — signed cookies on `dev.blockbusterindex.com`                          |

## Steps

1. Reproduce with `curl -sI` on apex vs www
2. Confirm response headers (`x-cache: LambdaGeneratedResponse` on redirects)
3. Run unit tests locally: `make test`
4. Inspect latest published version vs CloudFront association
5. Check CloudWatch logs in the Edge region that served the request

Do not rotate production triggers without explicit user approval.

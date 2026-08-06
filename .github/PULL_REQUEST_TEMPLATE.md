## Summary

<!-- What does this PR do? Why? -->

## Type

- [ ] Feature
- [ ] Fix
- [ ] Refactor
- [ ] Test
- [ ] Docs
- [ ] Chore / CI

## Checklist

### Required

- [ ] `make preflight` passes (lint, test, format-check, build, audit)
- [ ] Tests added/updated for behavior changes
- [ ] No secrets committed; `.env.example` updated if needed

### Lambda@Edge

- [ ] Handler remains CPU-only (no network/SDK)
- [ ] Redirect / rewrite behavior covered by tests
- [ ] CloudFormation / IAM changes called out for human review

### Docs

- [ ] Architecture / deploy / governance docs updated if behavior changed

## Review Notes

<!-- Risks, CloudFront association follow-up, etc. -->

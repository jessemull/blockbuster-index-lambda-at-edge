# Security

> **Precedence:** CONTEXT.md > GOVERNANCE.md > **SECURITY.md**.
>
> **AI agents — read this file when:** touching secrets, IAM, S3, workflows credentials, or logging.

---

## Secrets

- Never commit `.env`, PEM keys, or AWS keys.
- Local bastion config: `.env` (gitignored); document keys in `.env.example`.
- CI: `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` via GitHub Actions secrets only.
- Do not log credentials or full SSH commands with key paths in shared logs.

---

## IAM

- Role trust: `lambda.amazonaws.com` and `edgelambda.amazonaws.com`.
- Prefer least privilege: S3 GetObject limited to the deploy bucket; logs limited to `/aws/lambda/*` log groups.
- Broadening IAM is a **human-review** change.

---

## S3 deploy bucket

- Server-side encryption (AES256)
- Public access block enabled
- Versioning enabled
- Do not make the artifact bucket public

---

## Lambda@Edge

- No secrets in the function package (webpack must not bake `.env` into the bundle).
- Viewer-request code must not call outbound network APIs.

---

## Vulnerability response

- Run `make security` (`npm audit`) in preflight.
- Report issues via GitHub Security advisories or maintainers — see root `SECURITY.md`.

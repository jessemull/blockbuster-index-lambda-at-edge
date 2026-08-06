# Dependencies

> **Precedence:** CONTEXT.md > GOVERNANCE.md > **DEPENDENCIES.md**.
>
> **AI agents — read this file when:** adding or upgrading npm packages.

---

## Policy

- This package has **no production `dependencies`** — keep it that way for Edge bundle size.
- All tooling lives in `devDependencies`.
- New dependencies and **major** upgrades require **human review**.
- Run `npm audit` / `make security` after upgrades; resolve high/critical issues before merge.

---

## Peer constraints (current)

| Package       | Constraint               | Why                                    |
| ------------- | ------------------------ | -------------------------------------- |
| `typescript`  | stay on 6.0.x (`<6.1`)   | `@typescript-eslint` / `ts-jest` peers |
| `@types/node` | `^24`                    | Match Lambda/CI Node 24                |
| Jest          | 30.x with `ts-jest` 29.x | Supported peer range                   |

Do not force TypeScript 7 until the eslint/ts-jest ecosystem supports it.

---

## Upgrade workflow

1. `npm outdated`
2. Bump intentionally in `package.json`
3. `npm install` / refresh lockfile
4. `make preflight`
5. Note breaking changes in the PR

Use the `dependency-upgrade` Cursor skill when performing upgrades.

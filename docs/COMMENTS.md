# Comments

> **Precedence:** CONTEXT.md > GOVERNANCE.md > **COMMENTS.md**.
>
> **AI agents — read this file when:** writing or editing comments/docs in code.

---

## Goals

Comments explain **why**, not restate **what**. Prefer clear code over noisy commentary.

---

## Spacing (TypeScript)

### Standalone comments in code

- Empty line **above and below** standalone comments for readability.
- **Block start:** if the comment is the first line in a block, only require an empty line below.
- **Block end:** if the comment is last in a block, only require an empty line above.

### JSDoc

- Place JSDoc/block comments directly above the declaration — **no** blank line between comment and `function`/`const`/`export`.

### Inline trailing comments

- Avoid unless they clarify a non-obvious constant or regex; keep them short.

---

## Examples

```ts
export const handler = async (event: CloudFrontRequestEvent) => {
  // Redirect non-canonical domain to www...

  const hostHeader = headers["host"]?.[0]?.value?.toLowerCase();
  // ...
};
```

```ts
/**
 * Normalize a URL path...
 */
const normalizeUri = (uri: string): string | null => {
```

---

## Do not

- Comment out large dead code blocks — delete or restore via git.
- Leave TODOs without context; prefer issues for tracked work.

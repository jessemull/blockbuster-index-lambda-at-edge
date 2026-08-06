# Testing

> **Precedence:** CONTEXT.md > GOVERNANCE.md > ARCHITECTURE.md > **TESTING.md**.
>
> **AI agents — read this file when:** adding or changing tests, or touching coverage config.

---

## Stack

- **Jest** + **ts-jest**
- Coverage collected from `src/**/*.ts` excluding `*.test.ts`
- Global thresholds: **80%** branches, functions, lines, statements (`jest.config.js`)

---

## Philosophy

- Test **behavior**, not implementation trivia.
- Cover happy path, sad path, and Edge-relevant edges (trailing slashes, `..`, malformed URI, host casing, querystring).
- Prefer small focused cases over one giant test.

---

## CloudFront event mocks

Build events shaped like real viewer-request records:

```ts
{
  Records: [{
    cf: {
      request: {
        uri: "/about",
        querystring: "foo=bar",
        headers: { host: [{ value: "www.blockbusterindex.com" }] },
      },
    },
  }],
}
```

- Put query params in `querystring`, not in `uri`.
- Cast with `as unknown as CloudFrontRequestEvent` when fields are partial for edge cases.

---

## Commands

```bash
make test
# or: npm test
npm run test:watch
```

CI fails if tests fail or coverage thresholds are not met.

---

## When changing the handler

Update or add tests in `src/index.test.ts` in the same PR. Do not merge behavior changes without coverage.

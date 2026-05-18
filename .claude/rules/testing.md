---
globs: ["**/*.test.ts", "**/*.spec.ts"]
---

## Testing

- Test behaviour, not implementation details
- One concept per test; descriptive names: `should [outcome] when [condition]`
- Mock only at system boundaries (network, filesystem, external APIs)
- Mock at the module boundary, not inside functions
- Write a failing test that captures a bug before fixing it

**Unit**: isolated, fast, no real I/O
**Integration**: test real interactions between units; minimise mocking
**E2E**: cover primary user flows in a production-like environment; keep the suite lean

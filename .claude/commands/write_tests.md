Follow the conventions in rules/testing.md.

Write comprehensive tests for: $ARGUMENTS

Testing conventions:
* Use Vitest with React Testing Library for React based projects or `@vue/test-utils` for Vue
* Place test files in a __tests__ directory in the same folder as the source file
* Name test files as [filename].test.ts(x)
* Use @/ prefix for imports

Coverage:
* Test happy paths
* Test edge cases
* Test error states
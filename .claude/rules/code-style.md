## Code Style

- TypeScript for all new files
- ES modules only — `import`/`export`, never `require`/`module.exports`
- Destructure imports: `import { foo } from 'bar'`
- Function declarations for named, reusable functions; arrow functions otherwise
- Double quotes, no semicolons
- Functional patterns over imperative where it aids clarity
- Named exports by default; default exports only when a framework contract requires it
- No comments unless the *why* is non-obvious (hidden constraint, surprising behaviour, workaround)

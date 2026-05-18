Review the current working changes for code quality. For each changed file:

1. Remove unused imports, variables, props and dead code
2. Eliminate duplicate logic — extract shared utilities
3. Fix code smells: magic values, deep nesting, long functions, inconsistent naming, abbreviated identifiers, poor naming
4. Apply clear performance improvements (avoid premature optimisation)
5. Ensure style matches project conventions
6. If something can be done using CSS (style states, animations) prefer CSS over JS

After all changes, run the type checker and unit tests. Report a summary of what was changed and any remaining issues.

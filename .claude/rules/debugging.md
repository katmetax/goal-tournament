## Debugging

1. Read the full error and stack trace before acting
2. Reproduce with the smallest possible case
3. Check recent changes first: `git log -p --since=1.week`
4. Add targeted logging; remove it after the fix
5. Write a failing test capturing the bug before fixing it
6. Verify the fix doesn't break existing tests

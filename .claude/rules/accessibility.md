## Accessibility

Follow WCAG 2.1 AA as the baseline for all UI work.

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, etc.) over generic `<div>`/`<span>`
- Every interactive element must be keyboard-operable and have a visible focus state
- Images require descriptive `alt` text; decorative images use `alt=""`
- Form inputs must have associated `<label>` elements (not just placeholder text)
- Colour contrast: ≥4.5:1 for normal text, ≥3:1 for large text and UI components
- Dynamic content changes (modals, toasts, route changes) must be announced to screen readers — use ARIA live regions or focus management as appropriate
- Never use ARIA to override semantics when the correct HTML element exists
- Test keyboard navigation and run an automated checker (e.g. axe) before marking UI work done

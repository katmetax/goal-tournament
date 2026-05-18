# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Type-check + production build
pnpm preview      # Preview production build

pnpm test:unit              # Run all unit tests
pnpm test:unit -- path/to   # Run a single test file

pnpm lint         # ESLint + Oxlint (auto-fix)
pnpm format       # Oxfmt (src/ only)
pnpm type-check   # vue-tsc
```

The Stop hook runs `tsc --noEmit && eslint . && oxfmt src/ && vitest run` automatically — fix any failures before finishing.

## Architecture

**User journey** — linear, enforced by route guards in [src/router/index.ts](src/router/index.ts):

```
ModeSelectView → CustomInputView → SwipeView → TargetView → HeadToHeadView → ResultsView
```

Guards check Pinia state (e.g. `/swipe` requires `deck.length > 0`). Users cannot skip steps.

**State** — single Pinia store at [src/stores/journey.ts](src/stores/journey.ts). All cross-view data lives here: `deck`, `kept`, `target`, `winners`. No local persistence beyond the component lifecycle; no backend.

**Sharing** — [src/App.vue](src/App.vue) reads a `?r=` query param on load, decodes it via [src/utils/share.ts](src/utils/share.ts), and renders `ResultsView` in read-only mode. The rest of the router is bypassed.

**Components** are purely presentational — no store access, no API calls. All data flows in via props. [src/components/GoalCard.vue](src/components/GoalCard.vue) is the central UI piece: it accepts a `size` prop (`sm | md | lg | xl`) and derives rotation, stamp state, and color from props/drag state.

**SwipeView** ([src/views/SwipeView.vue](src/views/SwipeView.vue)) tracks pointer events with `setPointerCapture` for cross-device drag support, maintains an undo `history` array, and supports keyboard shortcuts (arrow keys + Cmd/Ctrl+Z).

**`@` alias** resolves to `src/`.

## Code Quality
When editing any file:
- Remove unused imports, variables, and dead code
- Eliminate duplicate logic by extracting shared utilities
- Fix code smells: magic values, deep nesting, long functions, poor naming
- Apply clear performance improvements (avoid premature optimisation)

## Framework Practices
Follow official documentation for every framework and library in use. Use idiomatic patterns.

# Goal Tournament

A tool for cutting through the noise when you have too many goals and not enough clarity. Start with a big pile of ambitions, swipe away the noise, then run a head-to-head bracket to surface the ones that truly matter.

Built for anyone who has ever written a list of goals and felt overwhelmed — the self-improver, the planner, the person staring at twelve things and not knowing where to start.

---

## How it works

**1. Build your deck**
Choose from a curated library of goal cards, type in your own, or mix both. Each card is a single goal — no descriptions, no friction.

**2. Swipe phase**
Cards appear one at a time. Swipe right (or tap Keep) to hold onto a goal; swipe left (or tap Pass) to drop it. Undo is available for the previous swipe. A progress indicator tracks where you are in the deck.

**3. Set your target**
After swiping, you see how many cards you kept. You pick the number you want to end up with — that becomes the target for the next phase.

**4. Head-to-head tournament**
Your kept cards enter an elimination bracket. Two cards face off; you pick one. The loser is eliminated. This repeats — with random pairings each round — until only your target number remains.

**5. Results**
Your final goals are displayed together. Share them via a URL that anyone can open to see a read-only version of your results, plus a plain-text list of the titles for copying elsewhere.

---

## How it was built

The original idea for this project came from a deck of cards called ["What do I really want to achieve?"](https://www.theschooloflife.com/shop/what-do-i-really-want-to-achieve/) by School of Life. I wanted to create a digital version of this, more geared towards work related goal setting for coaching sessions.

First, I expressed everything I wanted the tool to do (from the initial touch point all the way to the end) in an mildly structured way into a **Claude chat** and told it to ask me questions until it was certain enough it had enough clarity and information to generate a project overview with a thorough set of requirements (the brief).

Secondly, I took this brief and inputted it into **Claude Design**, it asked me some follow up question and then it created a couple different variations of the site. The first variation was great, the second was awful (black background, bright neon cards). I naturally went for the first variation.

Then, I "shared" the designs Claude Design had created with **Claude Code** and asked it to build the site.

Finally, after multiple iterations of adding tests, cleaning up the code and the UI on different devices, the project was done.

### What AI did well

- Created a more concrete brief (especially onced I asked the AI to question me on things) with speed
- Designed a UI that fits in with the modern standards
- Coded the project faster than I could have ever done (all the code took 10-15 minutes to generate!)

### What it sucked at

- Being creative with design: I do think the design Claude came up with lacks creativity and I remain firm on the fact that a designer could have done a much better job creating something creatively unique with this brief
- Code quality: Since I had generated the brief and the design using AI I decided to skip "plan mode" in Claude Code this time, which I think is what ultimately led to poorer consistency and patterns.
- Using CSS over inline styles: I am of the opinion that if you can solve something using CSS, always prefer that over JS. The browser reads CSS earlier and it is more efficient than JS. I also prefer not having inline styles as they can get messy pretty quickly. Claude did not share my opinion it seems as it consistently chose to use inline styles mixed with JS. I ended up adding a point in my Claude `/quality` command to mitigate this going forward.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (`<script setup>`) |
| State | Pinia |
| Routing | Vue Router 5 |
| Build | Vite 8 |
| Language | TypeScript |
| Testing | Vitest + Vue Test Utils |
| Linting | ESLint + Oxlint |
| Formatting | Oxfmt |

No backend. No accounts. All state lives in memory; results are shared as encoded URL parameters.

---

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- [pnpm](https://pnpm.io/)

---

## Getting started

```sh
pnpm install
pnpm dev
```

The dev server starts at `http://localhost:5173`.

---

## Commands

```sh
pnpm dev          # Start dev server with hot reload
pnpm build        # Type-check + production build
pnpm preview      # Preview the production build locally

pnpm test:unit              # Run all unit tests
pnpm test:unit -- path/to   # Run a single test file

pnpm lint         # ESLint + Oxlint (auto-fix)
pnpm format       # Oxfmt (src/ only)
pnpm type-check   # vue-tsc
```

## Issues

Notice any bugs? Feel free to raise an issue here on Github and I will look into it.

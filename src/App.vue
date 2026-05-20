<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { decodeShareToken } from '@/utils/share'
import { useJourneyStore } from '@/stores/journey'
import ResultsView from '@/views/ResultsView.vue'

const route = useRoute()
const router = useRouter()
const store = useJourneyStore()

const sharedWinners = computed(() => {
  const r = route.query.r
  if (typeof r !== 'string') return null
  return decodeShareToken(r)
})

const showHomeNav = computed(
  () => !sharedWinners.value && route.path !== '/' && route.path !== '/results',
)

function goHome() {
  store.reset()
  router.push('/')
}
</script>

<template>
  <ResultsView v-if="sharedWinners" :winners="sharedWinners" :read-only="true" />
  <template v-else>
    <nav v-if="showHomeNav" class="home-nav" aria-label="Site navigation">
      <button class="home-btn" @click="goHome">
        <svg
          class="home-icon"
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 6.5L8 1l7 5.5V15H10.5v-4h-5v4H1V6.5Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
        <span class="sr-only">Home</span>
      </button>
    </nav>
    <RouterView />
  </template>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  min-height: 100%;
}

body {
  background: #f6f1e7;
  color: #2a241c;
  font-family:
    'Inter',
    -apple-system,
    system-ui,
    sans-serif;
  -webkit-font-smoothing: antialiased;
}

:root {
  --bg: #f6f1e7;
  --bg-alt: #efe7d4;
  --ink: #2a241c;
  --ink-soft: #6b5f4d;
  --rule: #e2d6bd;
  --accent: #c8553d;
  --accent-ink: #fff8ec;
  --keep: #3f7a4a;
  --pass: #c8553d;
  --font-display: 'Fraunces', 'Times New Roman', serif;
  --font-body: 'Inter', -apple-system, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --card-radius: 22px;
  --button-radius: 999px;
  --panel-shadow: 0 2px 0 rgba(40, 30, 20, 0.06), 0 16px 40px -16px rgba(40, 30, 20, 0.18);
  --card-shadow:
    0 1px 0 rgba(255, 255, 255, 0.6) inset, 0 2px 0 rgba(40, 30, 20, 0.08),
    0 24px 50px -20px rgba(40, 30, 20, 0.35);
}

button {
  font-family: inherit;
  cursor: pointer;
}

textarea {
  font-family: inherit;
}

.home-nav {
  position: absolute;
  top: 24px;
  left: 20px;
  z-index: 100;
}

@media (max-width: 480px) {
  .home-nav {
    top: 16px;
  }
}

.home-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--bg-alt);
  border: 1.5px solid var(--rule);
  border-radius: var(--button-radius);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--ink-soft);
  text-transform: uppercase;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s;
}

.home-btn:hover,
.home-btn:focus-visible {
  color: var(--ink);
  border-color: var(--ink-soft);
  background: var(--bg);
  outline: none;
}

.home-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.home-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes popin {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes confetti-fall {
  0% {
    transform: translate3d(0, -20vh, 0) rotate(0deg);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  100% {
    transform: translate3d(var(--cx, 0), 120vh, 0) rotate(var(--cr, 720deg));
    opacity: 1;
  }
}
</style>

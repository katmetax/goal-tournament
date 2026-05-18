<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { decodeShareToken } from '@/utils/share'
import ResultsView from '@/views/ResultsView.vue'

const route = useRoute()

const sharedWinners = computed(() => {
  const r = route.query.r
  if (typeof r !== 'string') return null
  return decodeShareToken(r)
})
</script>

<template>
  <ResultsView v-if="sharedWinners" :winners="sharedWinners" :read-only="true" />
  <RouterView v-else />
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

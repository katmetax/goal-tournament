<script setup lang="ts">
import { useRouter } from 'vue-router'
import PREDEFINED_GOALS from '@/data/goals.json'
import { useJourneyStore } from '@/stores/journey'
import AppHeader from '@/components/AppHeader.vue'
import ModeCard from '@/components/ModeCard.vue'

const router = useRouter()
const store = useJourneyStore()

const MODES = [
  {
    id: 'predefined',
    label: 'Pre-defined',
    title: 'Start from the library',
    subtitle: 'A curated deck of 20 common goals.',
    preview: ['Travel more', 'Read 24 books', 'Run a marathon'],
  },
  {
    id: 'custom',
    label: 'Your own',
    title: 'Type your own goals',
    subtitle: 'Paste or write a list. We split on commas + newlines.',
    preview: ['ship v2', 'sleep at 11', 'call mum'],
  },
  {
    id: 'mixed',
    label: 'Mixed',
    title: 'Library + your own',
    subtitle: 'Start with the library, add your own on top.',
    preview: ['Library + custom'],
  },
]

function handleSelect(id: string) {
  if (id === 'predefined') {
    const shuffled = [...PREDEFINED_GOALS].sort(() => Math.random() - 0.5)
    store.setDeck(shuffled)
    router.push('/swipe')
  } else if (id === 'custom') {
    router.push('/custom')
  } else if (id === 'mixed') {
    router.push({ path: '/custom', query: { mixed: '1' } })
  }
}
</script>

<template>
  <main class="screen">
    <AppHeader
      title="Goal Tournament"
      subtitle="Whittle a big pile of goals down to the few that actually matter. Two phases: swipe to cut, then face-off to crown."
    />

    <div class="mode-grid" role="list">
      <ModeCard
        v-for="(mode, i) in MODES"
        :key="mode.id"
        :idx="i"
        :mode="mode"
        role="listitem"
        @click="handleSelect(mode.id)"
      />
    </div>

    <p class="footer">STEP 01 · CHOOSE A DECK</p>
  </main>
</template>

<style scoped>
.screen {
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 48px;
  gap: 48px;
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
  width: 100%;
  max-width: 1040px;
}

.footer {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--ink-soft);
  text-transform: uppercase;
  margin: 0;
}

@media (max-width: 600px) {
  .screen {
    padding: 40px 24px;
    gap: 32px;
  }
}
</style>

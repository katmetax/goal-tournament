<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PREDEFINED_GOALS from '@/data/goals.json'
import { useJourneyStore } from '@/stores/journey'
import AppHeader from '@/components/AppHeader.vue'
import ModeCard from '@/components/ModeCard.vue'
import HowItWorksModal from '@/components/HowItWorksModal.vue'

const router = useRouter()
const store = useJourneyStore()
const showHelp = ref(false)

const MODES = [
  {
    id: 'predefined',
    label: 'Pre-defined',
    title: 'Start from the library',
    subtitle: 'A curated deck of 20 common goals.',
    preview: ['Learn Dutch', 'Get AWS certified', 'Mentor a junior colleague'],
  },
  {
    id: 'custom',
    label: 'Your own',
    title: 'Type your own goals',
    subtitle: 'Paste or write a list. We split on commas + newlines.',
    preview: ['learn how to make mermaid graphs', 'teach Claude how to code', 'live laugh love'],
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

    <button
      class="help-btn"
      aria-label="How does this work?"
      title="How does this work?"
      @click="showHelp = true"
    >
      ?
    </button>

    <HowItWorksModal v-if="showHelp" @close="showHelp = false" />

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
  position: relative;
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

.help-btn {
  position: absolute;
  top: 28px;
  right: 28px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid var(--rule);
  background: transparent;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.16s;
  z-index: 20;
}

.help-btn:hover {
  background: var(--ink);
  color: var(--bg);
  border-color: var(--ink);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.help-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
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

@media (max-width: 780px) {
  .screen {
    padding: 40px 20px;
    gap: 24px;
    align-items: flex-start;
  }

  .mode-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  :deep(.header) {
    text-align: left;
    align-items: flex-start;
  }

  :deep(.header .title) {
    font-size: clamp(60px, 17vw, 76px);
    text-wrap: auto;
    text-align: center;
  }

  .help-btn {
    width: 38px;
    height: 38px;
  }

  .footer {
    align-self: center;
  }
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PREDEFINED_GOALS from '@/data/goals.json'
import { parseGoals } from '@/utils/goals'
import { useJourneyStore } from '@/stores/journey'
import AppHeader from '@/components/AppHeader.vue'
import AppBtn from '@/components/AppBtn.vue'
import GoalChip from '@/components/GoalChip.vue'

const route = useRoute()
const router = useRouter()
const store = useJourneyStore()

const mixed = computed(() => route.query.mixed === '1')
const text = ref('')
const parsed = computed(() => parseGoals(text.value))

const eyebrow = computed(() => (mixed.value ? 'Mixed mode' : 'Your own deck'))
const title = computed(() => (mixed.value ? 'Add your own goals' : 'Type your goals'))

function handleSubmit() {
  if (parsed.value.length < 2) return

  if (mixed.value) {
    const merged = [...PREDEFINED_GOALS, ...parsed.value]
    const seen = new Set<string>()
    const dedup = merged.filter((g) => {
      const k = g.toLowerCase().trim()
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    store.setDeck(dedup.sort(() => Math.random() - 0.5))
  } else {
    store.setDeck(parsed.value)
  }

  router.push('/swipe')
}
</script>

<template>
  <main class="screen">
    <AppHeader
      :eyebrow="eyebrow"
      :title="title"
      subtitle="Separate with commas or newlines. We'll turn each one into a card."
    />

    <div class="grid">
      <div>
        <label class="field-label" for="goals-input">Your goals</label>
        <textarea
          id="goals-input"
          v-model="text"
          class="textarea"
          placeholder="ship v2,&#10;sleep before 11pm,&#10;learn to surf,&#10;call mum every sunday"
        />
      </div>

      <div>
        <div class="field-label" aria-live="polite">
          Preview · {{ parsed.length }} {{ parsed.length === 1 ? 'card' : 'cards' }}
        </div>
        <div class="preview-panel">
          <p v-if="parsed.length === 0" class="empty-hint">Cards will appear here as you type.</p>
          <GoalChip v-for="(g, i) in parsed" :key="i" :idx="i">{{ g }}</GoalChip>
        </div>
      </div>
    </div>

    <div class="actions">
      <AppBtn kind="ghost" @click="$router.push('/')">← Back</AppBtn>
      <AppBtn kind="primary" :disabled="parsed.length < 2" @click="handleSubmit">
        {{ mixed ? `Add ${parsed.length} & start →` : `Start with ${parsed.length} cards →` }}
      </AppBtn>
    </div>
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
  gap: 36px;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 22px;
  width: 100%;
  max-width: 960px;
}

.field-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--ink-soft);
  margin-bottom: 10px;
  text-transform: uppercase;
}

.textarea {
  width: 100%;
  min-height: 320px;
  padding: 20px;
  border-radius: var(--card-radius);
  border: 1px solid var(--rule);
  background: var(--bg-alt);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.textarea:focus {
  border-color: var(--ink);
}

.preview-panel {
  min-height: 320px;
  padding: 18px;
  border-radius: var(--card-radius);
  border: 1px dashed var(--rule);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-content: flex-start;
  box-sizing: border-box;
}

.empty-hint {
  color: var(--ink-soft);
  font-size: 14px;
  padding: 8px;
  opacity: 0.6;
  margin: 0;
}

.actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 700px) {
  .screen {
    padding: 40px 24px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .textarea,
  .preview-panel {
    min-height: 160px;
  }
}
</style>

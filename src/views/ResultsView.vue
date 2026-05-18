<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJourneyStore } from '@/stores/journey'
import { encodeShareToken } from '@/utils/share'
import AppHeader from '@/components/AppHeader.vue'
import AppBtn from '@/components/AppBtn.vue'
import TrophyCard from '@/components/TrophyCard.vue'
import ConfettiEffect from '@/components/ConfettiEffect.vue'

interface Props {
  winners?: string[]
  readOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), { readOnly: false })

const router = useRouter()
const store = useJourneyStore()

const winners = computed(() => props.winners ?? store.winners)
const originalDeck = computed(() => (store.deck.length ? store.deck : winners.value))
const count = computed(() => winners.value.length)

function indexFor(title: string): number {
  const i = originalDeck.value.indexOf(title)
  return i >= 0 ? i : 0
}

const copied = ref(false)

async function handleShare() {
  const token = encodeShareToken(winners.value)
  const url = `${window.location.origin}/?r=${token}`
  const list = winners.value.map((w, i) => `${i + 1}. ${w}`).join('\n')
  const text = `My top ${count.value} ${count.value === 1 ? 'goal' : 'goals'}:\n${list}\n\n${url}`
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 2400)
  } catch {
    // clipboard not available
  }
}

function handleRestart() {
  store.reset()
  router.push('/')
}
</script>

<template>
  <main class="screen">
    <div class="backdrop" aria-hidden="true" />
    <ConfettiEffect v-if="!readOnly" />

    <AppHeader
      :eyebrow="readOnly ? 'Shared result' : `Step 05 · Final ${count}`"
      :title="
        readOnly
          ? `Someone's top goals.`
          : count === 1
            ? 'Your top goal.'
            : `Your top ${count} goals.`
      "
      :subtitle="
        readOnly
          ? 'A snapshot from a Goal Tournament run.'
          : 'The cards left standing after the cull and the knockout.'
      "
    />

    <div
      class="trophy-grid"
      :style="{
        gridTemplateColumns:
          count === 1 ? 'minmax(380px, 1fr)' : 'repeat(auto-fit, minmax(260px, 1fr))',
        maxWidth: count === 1 ? '440px' : '1080px',
      }"
    >
      <TrophyCard
        v-for="(title, i) in winners"
        :key="i"
        :title="title"
        :idx="indexFor(title)"
        :ordinal="i + 1"
        :delay="i * 0.1"
        :large="count === 1"
      />
    </div>

    <div v-if="!readOnly" class="actions">
      <AppBtn kind="ghost" @click="handleRestart">↺ Start over</AppBtn>
      <AppBtn kind="accent" @click="handleShare">
        {{ copied ? '✓ Copied link + list' : '↗ Share result' }}
      </AppBtn>
    </div>

    <div v-if="readOnly" class="readonly-badge">Read-only · Shared link</div>

    <a v-if="readOnly" class="start-own" href="/">← start your own</a>
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
  position: relative;
  overflow: hidden;
}

.backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(ellipse at 50% 30%, rgba(199, 85, 61, 0.07), transparent 55%);
}

.trophy-grid {
  display: grid;
  gap: 22px;
  width: 100%;
  justify-items: center;
  position: relative;
  z-index: 1;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.readonly-badge {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-soft);
  letter-spacing: 0.1em;
  padding: 12px 18px;
  border: 1px dashed var(--rule);
  border-radius: 8px;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
}

.start-own {
  position: fixed;
  bottom: 18px;
  left: 18px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-soft);
  opacity: 0.8;
  letter-spacing: 0.08em;
  text-decoration: underline;
}

@media (max-width: 600px) {
  .screen {
    padding: 40px 24px;
    gap: 32px;
  }
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJourneyStore } from '@/stores/journey'
import GoalCard from '@/components/GoalCard.vue'

interface Card {
  title: string
  originalIdx: number
}

const router = useRouter()
const store = useJourneyStore()

const pool = ref<Card[]>([])
const winnersThisRound = ref<Card[]>([])
const pendingPair = ref<[Card, Card] | null>(null)
const round = ref(1)
const pickedSide = ref<'left' | 'right' | null>(null)
const done = ref(false)

const target = computed(() => store.target)
const totalAlive = computed(() => pool.value.length + winnersThisRound.value.length)

interface CardPair {
  a: Card
  b: Card
}
const activePair = computed((): CardPair | null => {
  const p = pendingPair.value
  if (!p) return null
  const a = p[0]
  const b = p[1]
  if (!a || !b) return null
  return { a, b }
})

function pickLeft() {
  const p = activePair.value
  if (!p) return
  pickWinner(p.a, p.b, 'left')
}

function pickRight() {
  const p = activePair.value
  if (!p) return
  pickWinner(p.b, p.a, 'right')
}

function advanceTurn() {
  if (done.value) return

  const allAlive = pool.value.length + winnersThisRound.value.length

  if (allAlive <= target.value) {
    const final = [...pool.value, ...winnersThisRound.value]
    const titles = final.slice(0, target.value).map((c) => c.title)
    done.value = true
    store.setWinners(titles)
    router.push('/results')
    return
  }

  if (pool.value.length === 0) {
    pool.value = [...winnersThisRound.value]
    winnersThisRound.value = []
    round.value++
    advanceTurn()
    return
  }

  if (pool.value.length === 1) {
    // pool.value[0] is guaranteed to exist — length checked above
    const solo = pool.value[0]!
    if (winnersThisRound.value.length === 0) {
      winnersThisRound.value = [solo]
      pool.value = []
      advanceTurn()
      return
    }
    const oIdx = Math.floor(Math.random() * winnersThisRound.value.length)
    const opponent = winnersThisRound.value[oIdx]!
    pendingPair.value = [solo, opponent]
    return
  }

  const shuffled = [...pool.value].sort(() => Math.random() - 0.5)
  // shuffled has ≥2 items — length checked above
  pendingPair.value = [shuffled[0]!, shuffled[1]!]
}

function pickWinner(winner: Card, loser: Card, side: 'left' | 'right') {
  pickedSide.value = side
  setTimeout(() => {
    const newPool = pool.value.filter((c) => c !== winner && c !== loser)
    const loserWasFromWinners = winnersThisRound.value.includes(loser)
    let newWinners = [...winnersThisRound.value]
    if (loserWasFromWinners) newWinners = newWinners.filter((c) => c !== loser)
    if (!newWinners.includes(winner)) newWinners.push(winner)
    pool.value = newPool
    winnersThisRound.value = newWinners
    pendingPair.value = null
    pickedSide.value = null
    advanceTurn()
  }, 480)
}

onMounted(() => {
  pool.value = store.kept.map((title, i) => ({ title, originalIdx: i }))
  advanceTurn()
})
</script>

<template>
  <main class="screen">
    <div class="top-bar">
      <span class="eyebrow">Step 04 · Tournament · Round {{ round }}</span>
      <div class="alive-pill">
        <span
          ><strong>{{ totalAlive }}</strong> alive</span
        >
        <span class="dot-sep">·</span>
        <span
          >target <strong class="target-num">{{ target }}</strong></span
        >
      </div>
    </div>

    <div v-if="activePair" class="versus-area">
      <button
        class="picker-card"
        :class="{
          'picker-card--picked': pickedSide === 'left',
          'picker-card--lost': pickedSide === 'right',
        }"
        :disabled="pickedSide !== null"
        @click="pickLeft"
      >
        <div v-if="pickedSide === 'left'" class="winner-badge">WINNER</div>
        <GoalCard :title="activePair.a.title" :idx="activePair.a.originalIdx" size="xl" />
      </button>

      <div class="vs" aria-hidden="true">vs</div>

      <button
        class="picker-card"
        :class="{
          'picker-card--picked': pickedSide === 'right',
          'picker-card--lost': pickedSide === 'left',
        }"
        :disabled="pickedSide !== null"
        @click="pickRight"
      >
        <div v-if="pickedSide === 'right'" class="winner-badge">WINNER</div>
        <GoalCard :title="activePair.b.title" :idx="activePair.b.originalIdx" size="xl" />
      </button>
    </div>

    <div v-else class="loading">Setting up next match…</div>

    <p class="hint">Tap the one you want to keep</p>
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
  padding: 32px 24px;
  gap: 24px;
  position: relative;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--ink-soft);
  text-transform: uppercase;
}

.alive-pill {
  padding: 8px 18px;
  border-radius: 999px;
  background: var(--bg-alt);
  border: 1px solid var(--rule);
  font-family: var(--font-mono);
  font-size: 13px;
  display: flex;
  gap: 14px;
  align-items: center;
}

.dot-sep {
  color: var(--rule);
}

.target-num {
  color: var(--accent);
}

.versus-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  min-height: 520px;
}

.picker-card {
  all: unset;
  cursor: pointer;
  position: relative;
  transition:
    transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1.2),
    opacity 0.35s;
}

.picker-card:hover {
  transform: translateY(-6px);
}

.picker-card--picked {
  transform: scale(1.05) translateY(-8px) !important;
}

.picker-card--lost {
  transform: scale(0.9) translateY(20px) !important;
  opacity: 0.25;
}

.picker-card:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 4px;
  border-radius: var(--card-radius);
}

.winner-badge {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%) rotate(-4deg);
  background: var(--keep);
  color: var(--bg);
  padding: 6px 16px;
  border-radius: var(--button-radius);
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  z-index: 2;
  white-space: nowrap;
}

.vs {
  font-family: var(--font-display);
  font-size: 56px;
  font-weight: 600;
  letter-spacing: -0.04em;
  color: var(--ink-soft);
  font-style: italic;
  flex-shrink: 0;
}

.hint {
  text-align: center;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-soft);
  letter-spacing: 0.08em;
  margin: 0;
}

.loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--ink-soft);
}

@media (max-width: 780px) {
  .versus-area {
    flex-direction: column;
    gap: 16px;
    min-height: auto;
  }

  .vs {
    font-size: 36px;
  }
}
</style>

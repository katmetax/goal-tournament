<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useJourneyStore } from '@/stores/journey'
import SwipeProgress from '@/components/SwipeProgress.vue'
import AppBtn from '@/components/AppBtn.vue'
import CircleBtn from '@/components/CircleBtn.vue'
import GoalCard from '@/components/GoalCard.vue'

const router = useRouter()
const store = useJourneyStore()

const deck = computed(() => store.deck)
const total = computed(() => deck.value.length)

const idx = ref(0)
const kept = ref<string[]>([])
const history = ref<{ idx: number; wasKept: boolean }[]>([])
const drag = ref({ x: 0, y: 0, dragging: false })
const flying = ref<'left' | 'right' | null>(null)
const startPos = ref<{ x: number; y: number } | null>(null)

const THRESHOLD = 110

const rotation = computed(() => drag.value.x * 0.06)
const stampOpacity = computed(() => Math.min(Math.abs(drag.value.x) / 100, 1))
const stamp = computed(() => {
  if (drag.value.x > 30) return { kind: 'keep' as const, opacity: stampOpacity.value }
  if (drag.value.x < -30) return { kind: 'pass' as const, opacity: stampOpacity.value }
  return null
})

const flyX = computed(() => {
  if (flying.value === 'right') return 800
  if (flying.value === 'left') return -800
  return drag.value.x
})
const flyRot = computed(() => {
  if (flying.value === 'right') return 30
  if (flying.value === 'left') return -30
  return rotation.value
})

watch(
  () => [idx.value, flying.value] as const,
  ([newIdx, newFlying]) => {
    if (newIdx >= total.value && !newFlying) completeSwipe()
  },
)

function completeSwipe() {
  store.setKept(kept.value)
  if (kept.value.length === 0) {
    store.reset()
    router.push('/')
    return
  }
  if (kept.value.length === 1) {
    store.setWinners(kept.value)
    router.push('/results')
    return
  }
  router.push('/target')
}

function commit(isKeep: boolean) {
  if (flying.value || idx.value >= total.value) return
  flying.value = isKeep ? 'right' : 'left'
  const currentCard = deck.value[idx.value] ?? ''
  setTimeout(() => {
    history.value.push({ idx: idx.value, wasKept: isKeep })
    if (isKeep && currentCard) kept.value = [...kept.value, currentCard]
    idx.value++
    drag.value = { x: 0, y: 0, dragging: false }
    flying.value = null
  }, 260)
}

function undo() {
  if (!history.value.length) return
  const last = history.value[history.value.length - 1]
  if (!last) return
  history.value = history.value.slice(0, -1)
  if (last.wasKept) kept.value = kept.value.slice(0, -1)
  idx.value = last.idx
}

function onPointerDown(e: PointerEvent) {
  if (flying.value) return
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  startPos.value = { x: e.clientX, y: e.clientY }
  drag.value = { x: 0, y: 0, dragging: true }
}

function onPointerMove(e: PointerEvent) {
  if (!startPos.value || flying.value) return
  drag.value = {
    x: e.clientX - startPos.value.x,
    y: e.clientY - startPos.value.y,
    dragging: true,
  }
}

function onPointerUp() {
  if (!startPos.value || flying.value) return
  const dx = drag.value.x
  startPos.value = null
  if (dx > THRESHOLD) commit(true)
  else if (dx < -THRESHOLD) commit(false)
  else drag.value = { x: 0, y: 0, dragging: false }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') commit(true)
  else if (e.key === 'ArrowLeft') commit(false)
  else if ((e.key === 'z' && (e.metaKey || e.ctrlKey)) || e.key === 'Backspace') undo()
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <main class="screen">
    <div class="top-bar">
      <span class="eyebrow">Step 02 · Swipe phase</span>
      <SwipeProgress :current="idx" :total="total" :kept="kept.length" />
      <AppBtn
        kind="ghost"
        :disabled="!history.length"
        :style="{ opacity: history.length ? 1 : 0.35, padding: '8px 14px', fontSize: '13px' }"
        @click="undo"
      >
        ↶ Undo
      </AppBtn>
    </div>

    <div class="card-area">
      <div class="swipe-hint swipe-hint--left" :class="{ active: drag.x < -30 }" aria-hidden="true">
        PASS ←
      </div>
      <div class="swipe-hint swipe-hint--right" :class="{ active: drag.x > 30 }" aria-hidden="true">
        → KEEP
      </div>

      <template v-for="offset in [2, 1, 0]" :key="idx + offset">
        <div
          v-if="idx + offset < total"
          class="card-wrapper"
          :style="{
            transform: `translateY(${offset * 12}px) scale(${1 - offset * 0.04})`,
            zIndex: 10 - offset,
            pointerEvents: offset === 0 && !flying ? 'auto' : 'none',
            touchAction: 'none',
            cursor: offset === 0 ? (drag.dragging ? 'grabbing' : 'grab') : 'default',
          }"
          v-bind="
            offset === 0
              ? {
                  onPointerdown: onPointerDown,
                  onPointermove: onPointerMove,
                  onPointerup: onPointerUp,
                  onPointercancel: onPointerUp,
                }
              : {}
          "
        >
          <GoalCard
            :title="deck[idx + offset] ?? ''"
            :idx="idx + offset"
            size="xl"
            :drag-x="offset === 0 ? flyX : 0"
            :drag-y="offset === 0 ? drag.y : 0"
            :rotation="offset === 0 ? flyRot : 0"
            :dragging="offset === 0 && drag.dragging && !flying"
            :stamp="offset === 0 ? stamp : null"
          />
        </div>
      </template>
    </div>

    <div class="action-bar">
      <CircleBtn kind="pass" @click="commit(false)" />
      <p class="hint" aria-live="polite">drag, tap, or<br />← → arrow keys</p>
      <CircleBtn kind="keep" @click="commit(true)" />
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
  padding: 24px;
  gap: 16px;
  position: relative;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--ink-soft);
  text-transform: uppercase;
}

.card-area {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 580px;
}

.card-wrapper {
  position: absolute;
}

.swipe-hint {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) scale(1);
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--ink-soft);
  opacity: 0.35;
  transition: all 0.18s;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  text-transform: uppercase;
  pointer-events: none;
}

.swipe-hint--left {
  left: 6%;
}

.swipe-hint--right {
  right: 6%;
}

.swipe-hint.active {
  opacity: 1;
  transform: translateY(-50%) scale(1.1);
}

.swipe-hint--left.active {
  color: var(--pass);
}

.swipe-hint--right.active {
  color: var(--keep);
}

.action-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding-bottom: 8px;
}

.hint {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-soft);
  letter-spacing: 0.08em;
  text-align: center;
  width: 160px;
  margin: 0;
  line-height: 1.5;
}
</style>

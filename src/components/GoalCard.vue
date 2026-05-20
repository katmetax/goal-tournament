<script setup lang="ts">
import { computed } from 'vue'
import { colorForCard } from '@/utils/color'

interface Stamp {
  kind: 'keep' | 'pass'
  opacity: number
}

interface Props {
  title: string
  idx: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  flat?: boolean
  stamp?: Stamp | null
  rotation?: number
  dragX?: number
  dragY?: number
  dragging?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  flat: false,
  stamp: null,
  rotation: 0,
  dragX: 0,
  dragY: 0,
  dragging: false,
})

const color = computed(() => colorForCard(props.idx))

const cardStyle = computed(() => ({
  background: color.value.bg,
  color: color.value.ink,
  transform: `translate(${props.dragX}px, ${props.dragY}px) rotate(${props.rotation}deg)`,
}))
</script>

<template>
  <div class="goal-card" :class="[`size-${size}`, { flat, dragging }]" :style="cardStyle">
    <div class="card-index">nº{{ String(idx + 1).padStart(2, '0') }}</div>
    <div class="card-title">{{ title }}</div>
    <div
      v-if="stamp"
      class="stamp"
      :class="`stamp-${stamp.kind}`"
      :style="{ opacity: stamp.opacity }"
    >
      {{ stamp.kind === 'keep' ? 'KEEP' : 'PASS' }}
    </div>
  </div>
</template>

<style scoped>
.goal-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  background-image:
    radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.4), transparent 40%),
    radial-gradient(circle at 0% 100%, rgba(0, 0, 0, 0.05), transparent 40%);
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.01em;
  text-wrap: balance;
  user-select: none;
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1.2),
    box-shadow 0.2s;
}

.goal-card.flat {
  box-shadow: none;
}

.goal-card.dragging {
  transition: none;
}

.size-sm {
  --pad: 18px;
  width: 200px;
  height: 130px;
  font-size: 22px;
}

.size-md {
  --pad: 22px;
  width: 300px;
  height: 200px;
  font-size: 28px;
}

.size-lg {
  --pad: 28px;
  width: 360px;
  height: 260px;
  font-size: 36px;
}

.size-xl {
  --pad: 36px;
  width: 420px;
  height: 540px;
  font-size: 52px;
}

.goal-card {
  padding: var(--pad, 22px);
}

.card-index {
  position: absolute;
  top: var(--pad, 22px);
  left: var(--pad, 22px);
  font-family: var(--font-mono);
  font-size: 11px;
  opacity: 0.55;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.card-title {
  position: relative;
  z-index: 1;
}

.stamp {
  position: absolute;
  top: 28px;
  padding: 6px 18px;
  border: 4px solid;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.12em;
  background: rgba(255, 255, 255, 0.15);
  pointer-events: none;
  z-index: 3;
}

.stamp-keep {
  left: 24px;
  transform: rotate(-18deg);
  color: var(--keep);
  border-color: var(--keep);
}

.stamp-pass {
  right: 24px;
  transform: rotate(18deg);
  color: var(--pass);
  border-color: var(--pass);
}
</style>

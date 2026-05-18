<script setup lang="ts">
import { computed } from 'vue'
import { colorForCard } from '@/utils/color'

interface Props {
  title: string
  idx: number
  ordinal: number
  delay: number
  large?: boolean
}

const props = withDefaults(defineProps<Props>(), { large: false })
const color = computed(() => colorForCard(props.idx))
</script>

<template>
  <div
    class="trophy-card"
    :class="{ 'trophy-card--large': large }"
    :style="{
      background: color.bg,
      color: color.ink,
      animationDelay: `${delay}s`,
    }"
  >
    <div class="top-row">
      <div class="ordinal">· winner nº{{ String(ordinal).padStart(2, '0') }}</div>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        :fill="color.ink"
        style="opacity: 0.85; transform: rotate(8deg)"
        aria-hidden="true"
      >
        <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
      </svg>
    </div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<style scoped>
.trophy-card {
  border-radius: var(--card-radius);
  padding: 32px 28px;
  min-height: 220px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--card-shadow);
  position: relative;
  overflow: hidden;
  animation: popin 0.55s cubic-bezier(0.2, 0.7, 0.2, 1.2) both;
}

.trophy-card--large {
  min-height: 280px;
  max-width: 420px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.ordinal {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  opacity: 0.65;
  font-weight: 600;
}

.title {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.trophy-card--large .title {
  font-size: 56px;
}
</style>

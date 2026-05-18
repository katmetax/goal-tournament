<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  target: number
  max: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:target': [value: number] }>()

const nums = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))
</script>

<template>
  <div class="target-section">
    <div class="big-number">{{ target }}</div>
    <div class="label">final {{ target === 1 ? 'goal' : 'goals' }}</div>
    <div class="dot-row" role="group" :aria-label="`Select target: currently ${target}`">
      <button
        v-for="n in nums"
        :key="n"
        class="dot"
        :class="{ 'dot--selected': n === target }"
        :aria-pressed="n === target"
        :aria-label="`${n} ${n === 1 ? 'goal' : 'goals'}`"
        @click="emit('update:target', n)"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.target-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  background: var(--bg-alt);
  padding: 36px 48px;
  border-radius: var(--card-radius);
  border: 1.5px solid var(--rule);
  box-shadow: var(--panel-shadow);
}

.big-number {
  font-family: var(--font-display);
  font-size: 120px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--accent);
}

.label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--ink-soft);
  text-transform: uppercase;
}

.dot-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 520px;
}

.dot {
  all: unset;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  color: var(--ink);
  border: 1.5px solid var(--rule);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  transition: all 0.12s;
}

.dot--selected {
  background: var(--ink);
  color: var(--bg);
  border-color: var(--ink);
}

.dot:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}
</style>

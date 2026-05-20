<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  current: number
  total: number
  kept: number
}

const props = defineProps<Props>()

const pct = computed(() => (props.total > 0 ? Math.round((props.current / props.total) * 100) : 0))
const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <div class="progress">
    <span class="count">{{ pad(current) }} / {{ pad(total) }}</span>
    <span
      class="bar"
      role="progressbar"
      :aria-valuenow="current"
      aria-valuemin="0"
      :aria-valuemax="total"
    >
      <span class="bar__fill" :style="{ width: `${pct}%` }" />
    </span>
    <span class="kept">♥ {{ kept }}</span>
  </div>
</template>

<style scoped>
.progress {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 14px 8px 18px;
  border-radius: 999px;
  background: var(--bg-alt);
  border: 1.5px solid var(--rule);
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--ink);
  letter-spacing: 0.04em;
}

.bar {
  width: 100px;
  height: 4px;
  background: var(--rule);
  border-radius: 4px;
  overflow: hidden;
  display: block;
}

.bar__fill {
  display: block;
  height: 100%;
  background: var(--ink);
  transition: width 0.3s;
}

.kept {
  color: var(--keep);
  font-weight: 600;
}

@media (max-width: 480px) {
  .progress {
    gap: 10px;
    padding: 6px 12px;
  }

  .bar {
    display: none;
  }
}
</style>

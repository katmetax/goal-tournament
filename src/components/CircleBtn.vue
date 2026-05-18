<script setup lang="ts">
interface Props {
  kind: 'keep' | 'pass'
}

defineProps<Props>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button
    :class="['circle-btn', `circle-btn--${kind}`]"
    :style="{ '--kind-color': kind === 'keep' ? 'var(--keep)' : 'var(--pass)' }"
    :aria-label="kind === 'keep' ? 'Keep' : 'Pass'"
  >
    {{ kind === 'keep' ? '✓' : '✕' }}
  </button>
</template>

<style scoped>
.circle-btn {
  all: unset;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: transparent;
  color: var(--kind-color);
  border: 2.5px solid var(--kind-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
}

.circle-btn:hover {
  background: var(--kind-color);
  color: var(--bg);
  transform: scale(1.08);
}

.circle-btn:focus-visible {
  outline: 2px solid var(--kind-color);
  outline-offset: 3px;
}
</style>

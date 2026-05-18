<script setup lang="ts">
interface Props {
  kind?: 'primary' | 'secondary' | 'ghost' | 'accent'
  fullWidth?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), { kind: 'primary' })
</script>

<template>
  <button :class="['btn', `btn--${kind}`, { 'btn--full': fullWidth }]" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 16px;
  padding: 14px 26px;
  border-radius: var(--button-radius);
  cursor: pointer;
  transition:
    transform 0.12s,
    box-shadow 0.12s,
    background 0.15s;
  letter-spacing: 0;
  white-space: nowrap;
}

.btn--full {
  width: 100%;
}

.btn--primary {
  background: var(--ink);
  color: var(--bg);
  border: 2px solid var(--ink);
}

.btn--secondary {
  background: transparent;
  color: var(--ink);
  border: 2px solid var(--ink);
}

.btn--ghost {
  background: transparent;
  color: var(--ink-soft);
  border: 2px solid transparent;
}

.btn--accent {
  background: var(--accent);
  color: var(--accent-ink);
  border: 2px solid var(--accent);
}

.btn:active:not(:disabled) {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>

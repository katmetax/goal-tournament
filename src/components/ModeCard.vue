<script setup lang="ts">
import { computed } from 'vue'
import { colorForCard } from '@/utils/color'

interface Mode {
  label: string
  title: string
  subtitle: string
  preview: string[]
}

interface Props {
  idx: number
  mode: Mode
}

const props = defineProps<Props>()
defineEmits<{ click: [] }>()

const labelColor = computed(() => colorForCard(props.idx * 3 + 1))
</script>

<template>
  <button class="mode-card" @click="$emit('click')">
    <div class="label-chip" :style="{ background: labelColor.bg, color: labelColor.ink }">
      {{ mode.label }}
    </div>

    <div class="title">{{ mode.title }}</div>
    <div class="subtitle">{{ mode.subtitle }}</div>

    <div class="preview-row">
      <div
        v-for="(p, j) in mode.preview"
        :key="j"
        class="preview-chip"
        :style="{
          background: colorForCard(idx * 3 + j).bg,
          color: colorForCard(idx * 3 + j).ink,
        }"
      >
        {{ p }}
      </div>
    </div>
  </button>
</template>

<style scoped>
.mode-card {
  all: unset;
  cursor: pointer;
  background: var(--bg-alt);
  border: 1.5px solid var(--rule);
  border-radius: var(--card-radius);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition:
    transform 0.18s,
    box-shadow 0.18s,
    border-color 0.18s;
  min-height: 280px;
}

.mode-card:hover {
  border-color: var(--ink);
  transform: translateY(-4px);
  box-shadow: var(--panel-shadow);
}

.mode-card:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}

.label-chip {
  display: inline-flex;
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  font-weight: 600;
  text-transform: uppercase;
}

.title {
  font-family: var(--font-display);
  font-size: 30px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 600;
  color: var(--ink);
  text-wrap: balance;
}

.subtitle {
  font-size: 14px;
  line-height: 1.45;
  color: var(--ink-soft);
  flex: 1;
}

.preview-row {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.preview-chip {
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  font-family: var(--font-body);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.preview-chip:nth-child(1) {
  transform: rotate(-2deg);
}

.preview-chip:nth-child(3) {
  transform: rotate(2deg);
}
</style>

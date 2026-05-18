<script setup lang="ts">
import { computed } from 'vue'
import { colorForCard } from '@/utils/color'

interface Props {
  idx: number
}

const props = defineProps<Props>()
const color = computed(() => colorForCard(props.idx))
</script>

<template>
  <div class="chip" :style="{ background: color.bg, color: color.ink }">
    <slot />
  </div>
</template>

<style scoped>
.chip {
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-body);
}
</style>

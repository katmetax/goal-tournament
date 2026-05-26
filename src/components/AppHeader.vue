<script setup lang="ts">
interface Props {
  title: string
  eyebrow?: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="header">
    <div v-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
    <h1 class="title">{{ title }}</h1>
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.header {
  text-align: center;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
}

.title {
  font-family: var(--font-display);
  font-size: clamp(40px, 6vw, 76px);
  font-weight: 600;
  line-height: 0.98;
  letter-spacing: -0.035em;
  margin: 0;
  text-wrap: balance;
  color: var(--ink);
}

.subtitle {
  font-size: 17px;
  line-height: 1.45;
  color: var(--ink-soft);
  margin: 0;
  max-width: 560px;
  text-wrap: pretty;
}
</style>

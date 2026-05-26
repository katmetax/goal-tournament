<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJourneyStore } from '@/stores/journey'
import AppHeader from '@/components/AppHeader.vue'
import AppBtn from '@/components/AppBtn.vue'
import GoalChip from '@/components/GoalChip.vue'
import TargetSection from '@/components/TargetSection.vue'
import PageTopBar from '@/components/PageTopBar.vue'

const router = useRouter()
const store = useJourneyStore()

const kept = computed(() => store.kept)
const max = computed(() => Math.max(1, kept.value.length - 1))
const target = ref(Math.max(1, Math.min(3, max.value)))

function handleSubmit() {
  store.setTarget(target.value)
  router.push('/head-to-head')
}
</script>

<template>
  <main class="screen">
    <PageTopBar :eyebrow="`Step 03 · You kept ${kept.length} cards`" centered />
    <AppHeader
      title="How many do you want to end up with?"
      subtitle="Set your target. We'll run a knockout tournament until only this many remain."
    />

    <div class="chips" role="list" aria-label="Kept goals">
      <GoalChip v-for="(g, i) in kept" :key="i" :idx="i" role="listitem">{{ g }}</GoalChip>
    </div>

    <TargetSection :target="target" :max="max" @update:target="(n) => (target = n)" />

    <div class="actions">
      <AppBtn kind="ghost" @click="$router.push('/swipe')">← Back</AppBtn>
      <AppBtn kind="primary" @click="handleSubmit">Start tournament →</AppBtn>
    </div>
  </main>
</template>

<style scoped>
.screen {
  align-items: center;
  padding: 24px 48px;
  gap: 40px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  max-width: 900px;
}

@media (max-width: 600px) {
  .screen {
    padding: 16px 24px;
    gap: 28px;
  }
}
</style>

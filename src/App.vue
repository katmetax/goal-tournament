<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { decodeShareToken } from '@/utils/share'
import { useJourneyStore } from '@/stores/journey'
import ResultsView from '@/views/ResultsView.vue'

const route = useRoute()
const router = useRouter()
const store = useJourneyStore()

const sharedWinners = computed(() => {
  const r = route.query.r
  if (typeof r !== 'string') return null
  return decodeShareToken(r)
})

const showHomeNav = computed(
  () => !sharedWinners.value && route.path !== '/' && route.path !== '/results',
)

function goHome() {
  store.reset()
  router.push('/')
}
</script>

<template>
  <ResultsView v-if="sharedWinners" :winners="sharedWinners" :read-only="true" />
  <template v-else>
    <nav v-if="showHomeNav" class="home-nav" aria-label="Site navigation">
      <button class="home-btn" @click="goHome">
        <svg
          class="home-icon"
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 6.5L8 1l7 5.5V15H10.5v-4h-5v4H1V6.5Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
        <span class="sr-only">Home</span>
      </button>
    </nav>
    <RouterView />
  </template>
</template>

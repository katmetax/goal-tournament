import { createRouter, createWebHistory } from 'vue-router'
import { useJourneyStore } from '@/stores/journey'
import ResultsView from '@/views/ResultsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: () => import('@/views/ModeSelectView.vue') },
    { path: '/custom', component: () => import('@/views/CustomInputView.vue') },
    { path: '/swipe', component: () => import('@/views/SwipeView.vue') },
    { path: '/target', component: () => import('@/views/TargetView.vue') },
    { path: '/head-to-head', component: () => import('@/views/HeadToHeadView.vue') },
    { path: '/results', component: ResultsView },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFoundView.vue') },
  ],
})

router.beforeEach((to) => {
  const store = useJourneyStore()
  if (to.path === '/swipe' && !store.deck.length) return '/'
  if (to.path === '/target' && !store.kept.length) return '/'
  if (to.path === '/head-to-head' && !store.kept.length) return '/'
  if (to.path === '/results' && !store.winners.length) return '/'
  return true
})

export default router

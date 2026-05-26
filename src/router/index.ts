import { createRouter, createWebHistory } from 'vue-router'
import { useJourneyStore } from '@/stores/journey'
import ModeSelectView from '@/views/ModeSelectView.vue'
import CustomInputView from '@/views/CustomInputView.vue'
import SwipeView from '@/views/SwipeView.vue'
import TargetView from '@/views/TargetView.vue'
import HeadToHeadView from '@/views/HeadToHeadView.vue'
import ResultsView from '@/views/ResultsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: ModeSelectView },
    { path: '/custom', component: CustomInputView },
    { path: '/swipe', component: SwipeView },
    { path: '/target', component: TargetView },
    { path: '/head-to-head', component: HeadToHeadView },
    { path: '/results', component: ResultsView },
    { path: '/:pathMatch(.*)*', component: NotFoundView },
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

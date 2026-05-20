import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ModeSelectView from '@/views/ModeSelectView.vue'
import { useJourneyStore } from '@/stores/journey'

const ModeCardStub = {
  name: 'ModeCard',
  props: ['idx', 'mode'],
  emits: ['click'],
  template: '<button @click="$emit(\'click\')" :data-id="mode.id">{{ mode.label }}</button>',
}

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: ModeSelectView },
      { path: '/swipe', component: { template: '<div />' } },
      { path: '/custom', component: { template: '<div />' } },
    ],
  })
}

describe('ModeSelectView', () => {
  let router: ReturnType<typeof makeRouter>

  beforeEach(() => {
    setActivePinia(createPinia())
    router = makeRouter()
  })

  function mountView() {
    return mount(ModeSelectView, {
      global: {
        plugins: [router],
        stubs: { AppHeader: true, ModeCard: ModeCardStub },
      },
    })
  }

  it('should render 3 mode cards', () => {
    const wrapper = mountView()
    expect(wrapper.findAll('[data-id]')).toHaveLength(3)
  })

  it('should set deck from predefined goals and navigate to /swipe when predefined is selected', async () => {
    const store = useJourneyStore()
    const wrapper = mountView()
    await wrapper.find('[data-id="predefined"]').trigger('click')
    await router.isReady()
    expect(store.deck.length).toBeGreaterThan(0)
    expect(router.currentRoute.value.path).toBe('/swipe')
  })

  it('should navigate to /custom when custom is selected', async () => {
    const wrapper = mountView()
    await wrapper.find('[data-id="custom"]').trigger('click')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/custom')
    expect(router.currentRoute.value.query).not.toHaveProperty('mixed')
  })

  it('should navigate to /custom?mixed=1 when mixed is selected', async () => {
    const wrapper = mountView()
    await wrapper.find('[data-id="mixed"]').trigger('click')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/custom')
    expect(router.currentRoute.value.query.mixed).toBe('1')
  })

  it('should not set deck when navigating to custom or mixed modes', async () => {
    const store = useJourneyStore()
    const wrapper = mountView()
    await wrapper.find('[data-id="custom"]').trigger('click')
    expect(store.deck).toHaveLength(0)
  })

  it('should show the step indicator footer', () => {
    const wrapper = mountView()
    expect(wrapper.text()).toContain('STEP 01')
  })
})

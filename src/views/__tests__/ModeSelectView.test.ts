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

const HowItWorksModalStub = {
  name: 'HowItWorksModal',
  emits: ['close'],
  template:
    '<div data-testid="how-it-works-modal"><button @click="$emit(\'close\')">Close</button></div>',
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
        stubs: { AppHeader: true, ModeCard: ModeCardStub, HowItWorksModal: HowItWorksModalStub },
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

  it('should render the help button', () => {
    const wrapper = mountView()
    expect(wrapper.find('[aria-label="How does this work?"]').exists()).toBe(true)
  })

  it('should show the modal when the help button is clicked', async () => {
    const wrapper = mountView()
    expect(wrapper.find('[data-testid="how-it-works-modal"]').exists()).toBe(false)
    await wrapper.find('[aria-label="How does this work?"]').trigger('click')
    expect(wrapper.find('[data-testid="how-it-works-modal"]').exists()).toBe(true)
  })

  it('should hide the modal when it emits close', async () => {
    const wrapper = mountView()
    await wrapper.find('[aria-label="How does this work?"]').trigger('click')
    expect(wrapper.find('[data-testid="how-it-works-modal"]').exists()).toBe(true)
    await wrapper.find('[data-testid="how-it-works-modal"] button').trigger('click')
    expect(wrapper.find('[data-testid="how-it-works-modal"]').exists()).toBe(false)
  })
})

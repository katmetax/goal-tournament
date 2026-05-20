import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import TargetView from '@/views/TargetView.vue'
import { useJourneyStore } from '@/stores/journey'

const AppHeaderStub = {
  name: 'AppHeader',
  props: ['eyebrow', 'title', 'subtitle'],
  template: '<div><span data-testid="eyebrow">{{ eyebrow }}</span></div>',
}

const TargetSectionStub = {
  name: 'TargetSection',
  props: ['target', 'max'],
  emits: ['update:target'],
  template:
    '<div><span data-testid="target-display">{{ target }}</span><button data-testid="inc" @click="$emit(\'update:target\', target + 1)" /></div>',
}

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/target', component: TargetView },
      { path: '/head-to-head', component: { template: '<div />' } },
      { path: '/swipe', component: { template: '<div />' } },
    ],
  })
}

describe('TargetView', () => {
  let router: ReturnType<typeof makeRouter>
  let store: ReturnType<typeof useJourneyStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useJourneyStore()
    router = makeRouter()
  })

  function mountWithKept(kept: string[]) {
    store.setKept(kept)
    return mount(TargetView, {
      global: {
        plugins: [router],
        stubs: { AppHeader: AppHeaderStub, GoalChip: true, TargetSection: TargetSectionStub },
      },
    })
  }

  it('should display the kept count in the header eyebrow', () => {
    const wrapper = mountWithKept(['goal A', 'goal B', 'goal C'])
    expect(wrapper.find("[data-testid='eyebrow']").text()).toContain('3')
  })

  it('should default target to 3 when kept has more than 3 items', () => {
    const wrapper = mountWithKept(['a', 'b', 'c', 'd', 'e'])
    expect(wrapper.find("[data-testid='target-display']").text()).toBe('3')
  })

  it('should default target to min(3, kept.length - 1) when kept has fewer than 4', () => {
    const wrapper = mountWithKept(['a', 'b'])
    expect(wrapper.find("[data-testid='target-display']").text()).toBe('1')
  })

  it('should default target to 1 when only 1 card is kept', () => {
    const wrapper = mountWithKept(['only'])
    expect(wrapper.find("[data-testid='target-display']").text()).toBe('1')
  })

  it('should update target when TargetSection emits update:target', async () => {
    const wrapper = mountWithKept(['a', 'b', 'c', 'd', 'e'])
    await wrapper.find("[data-testid='inc']").trigger('click')
    expect(wrapper.find("[data-testid='target-display']").text()).toBe('4')
  })

  it('should call setTarget and navigate to /head-to-head on submit', async () => {
    const wrapper = mountWithKept(['a', 'b', 'c'])
    await wrapper.find('button.btn--primary').trigger('click')
    await router.isReady()
    expect(store.target).toBe(2)
    expect(router.currentRoute.value.path).toBe('/head-to-head')
  })

  it('should navigate back to /swipe when back button is clicked', async () => {
    const wrapper = mountWithKept(['a', 'b'])
    await wrapper.find('button.btn--ghost').trigger('click')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/swipe')
  })
})

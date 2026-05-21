import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import HeadToHeadView from '@/views/HeadToHeadView.vue'
import { useJourneyStore } from '@/stores/journey'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/head-to-head', component: HeadToHeadView },
      { path: '/results', component: { template: '<div />' } },
    ],
  })
}

const GoalCardStub = {
  name: 'GoalCard',
  props: ['title', 'idx', 'size'],
  template: '<div :data-title="title" />',
}

describe('HeadToHeadView', () => {
  let router: ReturnType<typeof makeRouter>
  let store: ReturnType<typeof useJourneyStore>

  beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
    store = useJourneyStore()
    router = makeRouter()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  async function mountWithKept(kept: string[], target = 1) {
    store.setKept(kept)
    store.setTarget(target)
    const wrapper = mount(HeadToHeadView, {
      global: { plugins: [router], stubs: { GoalCard: GoalCardStub } },
    })
    await nextTick()
    return wrapper
  }

  it('should display a pair of cards on mount', async () => {
    const wrapper = await mountWithKept(['run a marathon', 'read 24 books'], 1)
    const titles = wrapper.findAll('[data-title]').map((el) => el.attributes('data-title'))
    expect(titles).toContain('run a marathon')
    expect(titles).toContain('read 24 books')
  })

  it('should show the current round number', async () => {
    const wrapper = await mountWithKept(['goal A', 'goal B'], 1)
    expect(wrapper.text()).toContain('Round 1')
  })

  it('should display alive count and target in the status pill', async () => {
    const wrapper = await mountWithKept(['goal A', 'goal B'], 1)
    expect(wrapper.find('.alive-pill').text()).toContain('2')
    expect(wrapper.find('.alive-pill').text()).toContain('1')
  })

  it('should pick left card as winner when left picker is clicked', async () => {
    const wrapper = await mountWithKept(['goal A', 'goal B'], 1)
    const [leftBtn] = wrapper.findAll('button.picker-card')
    await leftBtn!.trigger('click')

    const leftTitle = leftBtn!.find('[data-title]').attributes('data-title')
    vi.advanceTimersByTime(500)
    await wrapper.vm.$nextTick()
    await router.isReady()

    expect(store.winners).toContain(leftTitle)
    expect(router.currentRoute.value.path).toBe('/results')
  })

  it('should pick right card as winner when right picker is clicked', async () => {
    const wrapper = await mountWithKept(['goal A', 'goal B'], 1)
    const buttons = wrapper.findAll('button.picker-card')
    const rightBtn = buttons[1]!
    await rightBtn.trigger('click')

    const rightTitle = rightBtn.find('[data-title]').attributes('data-title')
    vi.advanceTimersByTime(500)
    await wrapper.vm.$nextTick()
    await router.isReady()

    expect(store.winners).toContain(rightTitle)
    expect(router.currentRoute.value.path).toBe('/results')
  })

  it('should disable both pickers while a pick is being processed', async () => {
    const wrapper = await mountWithKept(['goal A', 'goal B'], 1)
    const [leftBtn] = wrapper.findAll('button.picker-card')
    await leftBtn!.trigger('click')
    const buttons = wrapper.findAll('button.picker-card')
    expect(buttons[0]!.attributes('disabled')).toBeDefined()
    expect(buttons[1]!.attributes('disabled')).toBeDefined()
  })

  it('should show WINNER badge on the picked card', async () => {
    const wrapper = await mountWithKept(['goal A', 'goal B'], 1)
    const [leftBtn] = wrapper.findAll('button.picker-card')
    await leftBtn!.trigger('click')
    expect(wrapper.find('.winner-badge').exists()).toBe(true)
    expect(wrapper.find('.winner-badge').text()).toBe('WINNER')
  })

  it('should navigate to /results and call setWinners when target is reached', async () => {
    const wrapper = await mountWithKept(['goal A', 'goal B'], 1)
    const [leftBtn] = wrapper.findAll('button.picker-card')
    await leftBtn!.trigger('click')
    vi.advanceTimersByTime(500)
    await wrapper.vm.$nextTick()
    await router.isReady()

    expect(store.winners.length).toBeGreaterThan(0)
    expect(router.currentRoute.value.path).toBe('/results')
  })

  it('should keep target number of winners when pool exceeds target', async () => {
    const wrapper = await mountWithKept(['A', 'B', 'C', 'D'], 2)

    async function pickLeft() {
      const [leftBtn] = wrapper.findAll('button.picker-card')
      if (leftBtn) {
        await leftBtn.trigger('click')
        vi.advanceTimersByTime(500)
        await wrapper.vm.$nextTick()
      }
    }

    for (let i = 0; i < 5; i++) {
      await pickLeft()
      if (router.currentRoute.value.path === '/results') break
    }

    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/results')
    expect(store.winners.length).toBe(2)
  })
})

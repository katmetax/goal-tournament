import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import SwipeView from '@/views/SwipeView.vue'
import { useJourneyStore } from '@/stores/journey'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/swipe', component: SwipeView },
      { path: '/target', component: { template: '<div />' } },
      { path: '/results', component: { template: '<div />' } },
      { path: '/', component: { template: '<div />' } },
    ],
  })
}

const stubs = {
  AppBtn: true,
  CircleBtn: {
    name: 'CircleBtn',
    props: ['kind'],
    emits: ['click'],
    template: '<button @click="$emit(\'click\')" :data-kind="kind" />',
  },
  GoalCard: {
    name: 'GoalCard',
    props: ['title', 'idx', 'size', 'dragX', 'dragY', 'rotation', 'dragging', 'stamp'],
    template: '<div :data-title="title" />',
  },
  SwipeProgress: true,
}

describe('SwipeView', () => {
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

  function mountWithDeck(deck: string[]) {
    store.setDeck(deck)
    return mount(SwipeView, {
      attachTo: document.body,
      global: { plugins: [router], stubs },
    })
  }

  it('should display the first card in the deck', () => {
    const wrapper = mountWithDeck(['learn piano', 'run a marathon'])
    expect(wrapper.find('[data-title="learn piano"]').exists()).toBe(true)
  })

  it('should keep a card and advance to the next when keep button is clicked', async () => {
    const wrapper = mountWithDeck(['goal A', 'goal B'])
    await wrapper.find('[data-kind="keep"]').trigger('click')
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-title="goal B"]').exists()).toBe(true)
  })

  it('should pass a card and advance to the next when pass button is clicked', async () => {
    const wrapper = mountWithDeck(['goal A', 'goal B'])
    await wrapper.find('[data-kind="pass"]').trigger('click')
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-title="goal B"]').exists()).toBe(true)
  })

  it('should disable the undo button initially', () => {
    const wrapper = mountWithDeck(['goal A', 'goal B'])
    const undoBtn = wrapper.findAllComponents({ name: 'AppBtn' })[0]
    expect(undoBtn?.props('disabled')).toBe(true)
  })

  it('should enable the undo button after a swipe', async () => {
    const wrapper = mountWithDeck(['goal A', 'goal B'])
    await wrapper.find('[data-kind="keep"]').trigger('click')
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()
    const undoBtn = wrapper.findAllComponents({ name: 'AppBtn' })[0]
    expect(undoBtn?.props('disabled')).toBe(false)
  })

  it('should undo the last swipe when undo is clicked', async () => {
    const wrapper = mountWithDeck(['goal A', 'goal B'])
    await wrapper.find('[data-kind="keep"]').trigger('click')
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-title="goal B"]').exists()).toBe(true)

    const undoBtn = wrapper.findAllComponents({ name: 'AppBtn' })[0]!
    await undoBtn.trigger('click')
    expect(wrapper.find('[data-title="goal A"]').exists()).toBe(true)
  })

  it('should keep card on ArrowRight keydown', async () => {
    const wrapper = mountWithDeck(['goal A', 'goal B'])
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-title="goal B"]').exists()).toBe(true)
  })

  it('should pass card on ArrowLeft keydown', async () => {
    const wrapper = mountWithDeck(['goal A', 'goal B'])
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-title="goal B"]').exists()).toBe(true)
  })

  it('should undo on Cmd+Z keydown', async () => {
    const wrapper = mountWithDeck(['goal A', 'goal B'])
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', metaKey: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-title="goal A"]').exists()).toBe(true)
  })

  it('should undo on Ctrl+Z keydown', async () => {
    const wrapper = mountWithDeck(['goal A', 'goal B'])
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-title="goal A"]').exists()).toBe(true)
  })

  it('should reset store and navigate to / when all cards are passed (0 kept)', async () => {
    const wrapper = mountWithDeck(['only card'])
    await wrapper.find('[data-kind="pass"]').trigger('click')
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
    expect(store.deck).toHaveLength(0)
  })

  it('should set winners and navigate to /results when exactly 1 card is kept', async () => {
    const wrapper = mountWithDeck(['only card'])
    await wrapper.find('[data-kind="keep"]').trigger('click')
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/results')
    expect(store.winners).toEqual(['only card'])
  })

  it('should set kept and navigate to /target when 2+ cards are kept', async () => {
    const wrapper = mountWithDeck(['card A', 'card B'])
    await wrapper.find('[data-kind="keep"]').trigger('click')
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()
    await wrapper.find('[data-kind="keep"]').trigger('click')
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/target')
    expect(store.kept).toEqual(['card A', 'card B'])
  })

  it('should remove keydown listener on unmount', () => {
    const wrapper = mountWithDeck(['goal A', 'goal B'])
    wrapper.unmount()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(store.deck).toHaveLength(2)
  })
})

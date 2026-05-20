import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ResultsView from '@/views/ResultsView.vue'
import { useJourneyStore } from '@/stores/journey'
import { encodeShareToken } from '@/utils/share'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/results', component: ResultsView },
      { path: '/', component: { template: '<div />' } },
    ],
  })
}

const AppHeaderStub = {
  name: 'AppHeader',
  props: ['eyebrow', 'title', 'subtitle'],
  template:
    '<div><span data-testid="header-eyebrow">{{ eyebrow }}</span><span data-testid="header-title">{{ title }}</span></div>',
}

const stubs = {
  AppHeader: AppHeaderStub,
  TrophyCard: {
    name: 'TrophyCard',
    props: ['title', 'idx', 'ordinal', 'delay', 'large'],
    template: '<div :data-title="title" :data-ordinal="ordinal" />',
  },
  ConfettiEffect: true,
}

describe('ResultsView', () => {
  let router: ReturnType<typeof makeRouter>
  let store: ReturnType<typeof useJourneyStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useJourneyStore()
    router = makeRouter()
  })

  function mountWithWinners(winners: string[], readOnly = false) {
    return mount(ResultsView, {
      props: { winners, readOnly },
      global: { plugins: [router], stubs },
    })
  }

  it('should render a trophy card for each winner', () => {
    const wrapper = mountWithWinners(['goal A', 'goal B', 'goal C'])
    const cards = wrapper.findAll('[data-title]')
    expect(cards).toHaveLength(3)
    expect(cards.map((c) => c.attributes('data-title'))).toEqual(['goal A', 'goal B', 'goal C'])
  })

  it('should assign correct ordinal positions to winners', () => {
    const wrapper = mountWithWinners(['first', 'second', 'third'])
    const cards = wrapper.findAll('[data-title]')
    expect(cards[0]!.attributes('data-ordinal')).toBe('1')
    expect(cards[1]!.attributes('data-ordinal')).toBe('2')
    expect(cards[2]!.attributes('data-ordinal')).toBe('3')
  })

  it('should show action buttons when not in read-only mode', () => {
    const wrapper = mountWithWinners(['goal A'])
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should hide action buttons in read-only mode', () => {
    const wrapper = mountWithWinners(['goal A'], true)
    expect(wrapper.find('.actions').exists()).toBe(false)
  })

  it('should show the read-only badge in read-only mode', () => {
    const wrapper = mountWithWinners(['goal A'], true)
    expect(wrapper.find('.readonly-badge').exists()).toBe(true)
  })

  it('should show the start-own link in read-only mode', () => {
    const wrapper = mountWithWinners(['goal A'], true)
    expect(wrapper.find('a.start-own').exists()).toBe(true)
    expect(wrapper.find('a.start-own').attributes('href')).toBe('/')
  })

  it('should not show the read-only badge when not in read-only mode', () => {
    const wrapper = mountWithWinners(['goal A'])
    expect(wrapper.find('.readonly-badge').exists()).toBe(false)
  })

  it('should show confetti when not in read-only mode', () => {
    const wrapper = mountWithWinners(['goal A'])
    expect(wrapper.findComponent({ name: 'ConfettiEffect' }).exists()).toBe(true)
  })

  it('should not show confetti in read-only mode', () => {
    const wrapper = mountWithWinners(['goal A'], true)
    expect(wrapper.findComponent({ name: 'ConfettiEffect' }).exists()).toBe(false)
  })

  it('should copy share text to clipboard when share button is clicked', async () => {
    const writeMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText: writeMock } })

    const wrapper = mountWithWinners(['goal A', 'goal B'])
    await wrapper.find('button.btn--accent').trigger('click')
    await wrapper.vm.$nextTick()

    expect(writeMock).toHaveBeenCalledOnce()
    const written = writeMock.mock.calls[0]![0] as string
    expect(written).toContain('goal A')
    expect(written).toContain('goal B')

    const token = encodeShareToken(['goal A', 'goal B'])
    expect(written).toContain(token)
  })

  it('should copy a numbered plain-text list followed by a share URL', async () => {
    const writeMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText: writeMock } })

    const winners = ['learn to surf', 'read 24 books', 'call mum']
    const wrapper = mountWithWinners(winners)
    await wrapper.find('button.btn--accent').trigger('click')
    await wrapper.vm.$nextTick()

    const written = writeMock.mock.calls[0]![0] as string
    const token = encodeShareToken(winners)
    const expected = [
      'My top 3 goals:',
      '1. learn to surf',
      '2. read 24 books',
      '3. call mum',
      '',
      `${window.location.origin}/?r=${token}`,
    ].join('\n')

    expect(written).toBe(expected)
  })

  it('should change share button text to "Copied" after copying', async () => {
    vi.useFakeTimers()
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
    const wrapper = mountWithWinners(['goal A'])
    await wrapper.find('button.btn--accent').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button.btn--accent').text()).toContain('Copied')
    vi.useRealTimers()
  })

  it('should reset store and navigate to / when restart button is clicked', async () => {
    store.setDeck(['a', 'b'])
    store.setKept(['a'])
    const wrapper = mountWithWinners(['goal A'])
    await wrapper.find('button.btn--ghost').trigger('click')
    await router.isReady()

    expect(store.deck).toHaveLength(0)
    expect(store.kept).toHaveLength(0)
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('should fall back to store winners when no winners prop is provided', () => {
    store.setWinners(['from store'])
    const wrapper = mount(ResultsView, {
      global: { plugins: [router], stubs },
    })
    expect(wrapper.find('[data-title="from store"]').exists()).toBe(true)
  })

  it('should show singular title when there is exactly 1 winner', () => {
    const wrapper = mountWithWinners(['the one goal'])
    expect(wrapper.find("[data-testid='header-title']").text()).toContain('Your top goal.')
  })

  it('should show plural title with count when there are multiple winners', () => {
    const wrapper = mountWithWinners(['goal A', 'goal B', 'goal C'])
    expect(wrapper.find("[data-testid='header-title']").text()).toContain('Your top 3 goals.')
  })

  it('should show read-only eyebrow in read-only mode', () => {
    const wrapper = mountWithWinners(['goal A'], true)
    expect(wrapper.find("[data-testid='header-eyebrow']").text()).toContain('Shared result')
  })
})

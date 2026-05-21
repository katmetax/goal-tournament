import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import CustomInputView from '@/views/CustomInputView.vue'
import { useJourneyStore } from '@/stores/journey'
import PREDEFINED_GOALS from '@/data/goals.json'

const AppHeaderStub = {
  name: 'AppHeader',
  props: ['title', 'subtitle'],
  template: '<div />',
}

const PageTopBarStub = {
  name: 'PageTopBar',
  props: ['eyebrow', 'centered', 'stackCenterOnMobile', 'stackRightOnMobile'],
  template: '<div><span data-testid="eyebrow">{{ eyebrow }}</span></div>',
}

function makeRouter(path = '/custom') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/custom', component: CustomInputView },
      { path: '/swipe', component: { template: '<div />' } },
      { path: '/', component: { template: '<div />' } },
    ],
  })
  router.push(path)
  return router
}

describe('CustomInputView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  async function mountView(mixed = false) {
    const router = makeRouter(mixed ? '/custom?mixed=1' : '/custom')
    await router.isReady()
    return {
      wrapper: mount(CustomInputView, {
        global: {
          plugins: [router],
          stubs: { AppHeader: AppHeaderStub, PageTopBar: PageTopBarStub, GoalChip: true },
        },
      }),
      router,
    }
  }

  it('should show "Your own deck" eyebrow in default mode', async () => {
    const { wrapper } = await mountView()
    expect(wrapper.find("[data-testid='eyebrow']").text()).toContain('Your own deck')
  })

  it('should show "Mixed mode" eyebrow when ?mixed=1', async () => {
    const { wrapper } = await mountView(true)
    expect(wrapper.find("[data-testid='eyebrow']").text()).toContain('Mixed mode')
  })

  it('should parse comma-separated goals and update the live preview count', async () => {
    const { wrapper } = await mountView()
    await wrapper.find('textarea').setValue('run a marathon, read 24 books, sleep well')
    expect(wrapper.find("[aria-live='polite']").text()).toContain('3')
  })

  it('should parse newline-separated goals', async () => {
    const { wrapper } = await mountView()
    await wrapper.find('textarea').setValue('goal one\ngoal two\ngoal three')
    expect(wrapper.find("[aria-live='polite']").text()).toContain('3')
  })

  it('should disable the submit button when fewer than 2 goals are entered', async () => {
    const { wrapper } = await mountView()
    await wrapper.find('textarea').setValue('only one goal')
    const submitBtn = wrapper.find('button.btn--primary')
    expect(submitBtn.attributes('disabled')).toBeDefined()
  })

  it('should enable the submit button when 2 or more goals are entered', async () => {
    const { wrapper } = await mountView()
    await wrapper.find('textarea').setValue('goal one, goal two')
    const submitBtn = wrapper.find('button.btn--primary')
    expect(submitBtn.attributes('disabled')).toBeUndefined()
  })

  it('should disable submit when textarea is empty', async () => {
    const { wrapper } = await mountView()
    const submitBtn = wrapper.find('button.btn--primary')
    expect(submitBtn.attributes('disabled')).toBeDefined()
  })

  it('should call setDeck with parsed goals and navigate to /swipe on submit', async () => {
    const store = useJourneyStore()
    const { wrapper, router } = await mountView()
    await wrapper.find('textarea').setValue('run more, read more')
    await wrapper.find('button.btn--primary').trigger('click')
    await flushPromises()
    expect(store.deck).toEqual(['run more', 'read more'])
    expect(router.currentRoute.value.path).toBe('/swipe')
  })

  it('should merge and deduplicate with predefined goals in mixed mode', async () => {
    const store = useJourneyStore()
    const { wrapper, router } = await mountView(true)
    const customGoal = 'my unique goal abc123'
    const duplicateGoal = PREDEFINED_GOALS[0] as string
    await wrapper.find('textarea').setValue(`${customGoal}, ${duplicateGoal}`)
    await wrapper.find('button.btn--primary').trigger('click')
    await flushPromises()

    expect(store.deck).toContain(customGoal)
    expect(store.deck).toContain(duplicateGoal)
    const occurrences = store.deck.filter(
      (g) => g.toLowerCase().trim() === duplicateGoal.toLowerCase().trim(),
    ).length
    expect(occurrences).toBe(1)
    expect(store.deck.length).toBeGreaterThan(PREDEFINED_GOALS.length)
    expect(router.currentRoute.value.path).toBe('/swipe')
  })

  it('should navigate back to / when back button is clicked', async () => {
    const { wrapper, router } = await mountView()
    await wrapper.find('button.btn--ghost').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/')
  })
})

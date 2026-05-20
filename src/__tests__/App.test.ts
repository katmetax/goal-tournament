import { describe, it, expect, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import { encodeShareToken } from '@/utils/share'

const ResultsViewStub = defineComponent({
  name: 'ResultsView',
  props: ['winners', 'readOnly'],
  template:
    '<div data-testid="results-view" :data-readonly="readOnly" :data-winners="JSON.stringify(winners)" />',
})

function makeRouter(path = '/') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })
  router.push(path)
  return router
}

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render RouterView when no share token is present', async () => {
    const router = makeRouter('/')
    await router.isReady()
    const wrapper = mount(App, {
      global: { plugins: [router], stubs: { ResultsView: ResultsViewStub } },
    })
    expect(wrapper.find('[data-testid="results-view"]').exists()).toBe(false)
  })

  it('should render ResultsView in read-only mode when valid share token is present', async () => {
    const token = encodeShareToken(['goal one', 'goal two'])
    const router = makeRouter(`/?r=${token}`)
    await router.isReady()
    const wrapper = mount(App, {
      global: { plugins: [router], stubs: { ResultsView: ResultsViewStub } },
    })
    const view = wrapper.find('[data-testid="results-view"]')
    expect(view.exists()).toBe(true)
    expect(view.attributes('data-readonly')).toBe('true')
    expect(JSON.parse(view.attributes('data-winners') ?? '[]')).toEqual(['goal one', 'goal two'])
  })

  it('should render RouterView when share token is invalid', async () => {
    const router = makeRouter('/?r=not-valid-base64!!!')
    await router.isReady()
    const wrapper = mount(App, {
      global: { plugins: [router], stubs: { ResultsView: ResultsViewStub } },
    })
    expect(wrapper.find('[data-testid="results-view"]').exists()).toBe(false)
  })

  it('should render RouterView when token decodes to non-array winners', async () => {
    const bad = btoa(JSON.stringify({ w: 'not-an-array' }))
    const router = makeRouter(`/?r=${bad}`)
    await router.isReady()
    const wrapper = mount(App, {
      global: { plugins: [router], stubs: { ResultsView: ResultsViewStub } },
    })
    expect(wrapper.find('[data-testid="results-view"]').exists()).toBe(false)
  })
})

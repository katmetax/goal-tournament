import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBtn from '@/components/AppBtn.vue'

describe('AppBtn', () => {
  it('should render slot content', () => {
    const wrapper = mount(AppBtn, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toBe('Click me')
  })

  it('should default to primary kind', () => {
    const wrapper = mount(AppBtn)
    expect(wrapper.find('button').classes()).toContain('btn--primary')
  })

  it('should apply the correct kind class when kind prop is set', async () => {
    for (const kind of ['primary', 'secondary', 'ghost', 'accent'] as const) {
      const wrapper = mount(AppBtn, { props: { kind } })
      expect(wrapper.find('button').classes()).toContain(`btn--${kind}`)
    }
  })

  it('should add btn--full class when fullWidth is true', () => {
    const wrapper = mount(AppBtn, { props: { fullWidth: true } })
    expect(wrapper.find('button').classes()).toContain('btn--full')
  })

  it('should not add btn--full class when fullWidth is false', () => {
    const wrapper = mount(AppBtn, { props: { fullWidth: false } })
    expect(wrapper.find('button').classes()).not.toContain('btn--full')
  })

  it('should set disabled attribute when disabled prop is true', () => {
    const wrapper = mount(AppBtn, { props: { disabled: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('should not set disabled attribute when disabled prop is false', () => {
    const wrapper = mount(AppBtn, { props: { disabled: false } })
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })
})

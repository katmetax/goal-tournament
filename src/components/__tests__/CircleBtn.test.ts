import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CircleBtn from '@/components/CircleBtn.vue'

describe('CircleBtn', () => {
  it('should render ✓ and have aria-label "Keep" for keep kind', () => {
    const wrapper = mount(CircleBtn, { props: { kind: 'keep' } })
    expect(wrapper.find('button').text()).toBe('✓')
    expect(wrapper.find('button').attributes('aria-label')).toBe('Keep')
  })

  it('should render ✕ and have aria-label "Pass" for pass kind', () => {
    const wrapper = mount(CircleBtn, { props: { kind: 'pass' } })
    expect(wrapper.find('button').text()).toBe('✕')
    expect(wrapper.find('button').attributes('aria-label')).toBe('Pass')
  })

  it('should apply circle-btn--keep class for keep kind', () => {
    const wrapper = mount(CircleBtn, { props: { kind: 'keep' } })
    expect(wrapper.find('button').classes()).toContain('circle-btn--keep')
  })

  it('should apply circle-btn--pass class for pass kind', () => {
    const wrapper = mount(CircleBtn, { props: { kind: 'pass' } })
    expect(wrapper.find('button').classes()).toContain('circle-btn--pass')
  })
})

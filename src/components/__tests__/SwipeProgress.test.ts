import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SwipeProgress from '@/components/SwipeProgress.vue'

describe('SwipeProgress', () => {
  it('should display zero-padded current and total', () => {
    const wrapper = mount(SwipeProgress, { props: { current: 3, total: 10, kept: 2 } })
    expect(wrapper.find('.count').text()).toBe('03 / 10')
  })

  it('should display the kept count with a heart', () => {
    const wrapper = mount(SwipeProgress, { props: { current: 3, total: 10, kept: 5 } })
    expect(wrapper.find('.kept').text()).toBe('♥ 5')
  })

  it('should set progressbar aria attributes correctly', () => {
    const wrapper = mount(SwipeProgress, { props: { current: 4, total: 8, kept: 1 } })
    const bar = wrapper.find('[role="progressbar"]')
    expect(bar.attributes('aria-valuenow')).toBe('4')
    expect(bar.attributes('aria-valuemin')).toBe('0')
    expect(bar.attributes('aria-valuemax')).toBe('8')
  })

  it('should set fill width proportional to progress', () => {
    const wrapper = mount(SwipeProgress, { props: { current: 5, total: 10, kept: 0 } })
    expect(wrapper.find('.bar__fill').attributes('style')).toContain('width: 50%')
  })

  it('should show 0% fill when current is 0', () => {
    const wrapper = mount(SwipeProgress, { props: { current: 0, total: 10, kept: 0 } })
    expect(wrapper.find('.bar__fill').attributes('style')).toContain('width: 0%')
  })

  it('should show 100% fill when current equals total', () => {
    const wrapper = mount(SwipeProgress, { props: { current: 10, total: 10, kept: 3 } })
    expect(wrapper.find('.bar__fill').attributes('style')).toContain('width: 100%')
  })

  it('should show 0% fill when total is 0 to avoid division by zero', () => {
    const wrapper = mount(SwipeProgress, { props: { current: 0, total: 0, kept: 0 } })
    expect(wrapper.find('.bar__fill').attributes('style')).toContain('width: 0%')
  })

  it('should round percentage to nearest integer', () => {
    // 1/3 = 33.33...% → rounds to 33%
    const wrapper = mount(SwipeProgress, { props: { current: 1, total: 3, kept: 0 } })
    expect(wrapper.find('.bar__fill').attributes('style')).toContain('width: 33%')
  })
})

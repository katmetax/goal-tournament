import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TrophyCard from '@/components/TrophyCard.vue'

describe('TrophyCard', () => {
  it('should render the title', () => {
    const wrapper = mount(TrophyCard, {
      props: { title: 'Learn to code', idx: 0, ordinal: 1, delay: 0 },
    })
    expect(wrapper.find('.title').text()).toBe('Learn to code')
  })

  it('should render a zero-padded ordinal in the top row', () => {
    const wrapper = mount(TrophyCard, {
      props: { title: 'Goal', idx: 0, ordinal: 3, delay: 0 },
    })
    expect(wrapper.find('.ordinal').text()).toContain('winner nº03')
  })

  it('should render ordinal with two digits for single-digit values', () => {
    const wrapper = mount(TrophyCard, {
      props: { title: 'Goal', idx: 0, ordinal: 1, delay: 0 },
    })
    expect(wrapper.find('.ordinal').text()).toContain('winner nº01')
  })

  it('should not add trophy-card--large class by default', () => {
    const wrapper = mount(TrophyCard, {
      props: { title: 'Goal', idx: 0, ordinal: 1, delay: 0 },
    })
    expect(wrapper.find('.trophy-card').classes()).not.toContain('trophy-card--large')
  })

  it('should add trophy-card--large class when large is true', () => {
    const wrapper = mount(TrophyCard, {
      props: { title: 'Goal', idx: 0, ordinal: 1, delay: 0, large: true },
    })
    expect(wrapper.find('.trophy-card').classes()).toContain('trophy-card--large')
  })

  it('should apply animation delay from props', () => {
    const wrapper = mount(TrophyCard, {
      props: { title: 'Goal', idx: 0, ordinal: 1, delay: 0.3 },
    })
    expect(wrapper.find('.trophy-card').attributes('style')).toContain('animation-delay: 0.3s')
  })

  it('should apply background color from colorForCard', () => {
    const wrapper = mount(TrophyCard, {
      props: { title: 'Goal', idx: 0, ordinal: 1, delay: 0 },
    })
    // idx 0 → RAINBOW[0] = { bg: '#f7c59f', ink: '#3a2310' }
    const style = wrapper.find('.trophy-card').attributes('style')
    expect(style).toContain('background: rgb(247, 197, 159)')
  })

  it('should render the star SVG icon', () => {
    const wrapper = mount(TrophyCard, {
      props: { title: 'Goal', idx: 0, ordinal: 1, delay: 0 },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
  })
})

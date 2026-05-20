import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GoalCard from '@/components/GoalCard.vue'

describe('GoalCard', () => {
  it('should render the card title', () => {
    const wrapper = mount(GoalCard, { props: { title: 'Run a marathon', idx: 0 } })
    expect(wrapper.find('.card-title').text()).toBe('Run a marathon')
  })

  it('should render a zero-padded card index', () => {
    const wrapper = mount(GoalCard, { props: { title: 'Goal', idx: 4 } })
    expect(wrapper.find('.card-index').text()).toBe('nº05')
  })

  it('should render card index with two digits for single-digit idx', () => {
    const wrapper = mount(GoalCard, { props: { title: 'Goal', idx: 0 } })
    expect(wrapper.find('.card-index').text()).toBe('nº01')
  })

  it('should not render a stamp element when stamp prop is null', () => {
    const wrapper = mount(GoalCard, { props: { title: 'Goal', idx: 0, stamp: null } })
    expect(wrapper.findAll('[style*="KEEP"]').length).toBe(0)
    const stampEl = wrapper.find('.goal-card > div:nth-child(3)')
    expect(stampEl.exists()).toBe(false)
  })

  it('should render KEEP stamp when stamp kind is keep', () => {
    const wrapper = mount(GoalCard, {
      props: { title: 'Goal', idx: 0, stamp: { kind: 'keep', opacity: 1 } },
    })
    const stampDivs = wrapper.findAll('div').filter((el) => el.text() === 'KEEP')
    expect(stampDivs.length).toBeGreaterThan(0)
  })

  it('should render PASS stamp when stamp kind is pass', () => {
    const wrapper = mount(GoalCard, {
      props: { title: 'Goal', idx: 0, stamp: { kind: 'pass', opacity: 1 } },
    })
    const stampDivs = wrapper.findAll('div').filter((el) => el.text() === 'PASS')
    expect(stampDivs.length).toBeGreaterThan(0)
  })

  it('should apply stamp opacity from props', () => {
    const wrapper = mount(GoalCard, {
      props: { title: 'Goal', idx: 0, stamp: { kind: 'keep', opacity: 0.5 } },
    })
    const stampEl = wrapper.findAll('div').find((el) => el.text() === 'KEEP')
    expect(stampEl!.attributes('style')).toContain('opacity: 0.5')
  })

  it('should apply rotation via transform style', () => {
    const wrapper = mount(GoalCard, { props: { title: 'Goal', idx: 0, rotation: 15 } })
    expect(wrapper.find('.goal-card').attributes('style')).toContain('rotate(15deg)')
  })

  it('should apply drag translation via transform style', () => {
    const wrapper = mount(GoalCard, { props: { title: 'Goal', idx: 0, dragX: 40, dragY: -10 } })
    const style = wrapper.find('.goal-card').attributes('style')
    expect(style).toContain('translate(40px, -10px)')
  })

  it('should use size md dimensions by default', () => {
    const wrapper = mount(GoalCard, { props: { title: 'Goal', idx: 0 } })
    expect(wrapper.find('.goal-card').classes()).toContain('size-md')
  })

  it('should apply correct dimensions for xl size', () => {
    const wrapper = mount(GoalCard, { props: { title: 'Goal', idx: 0, size: 'xl' } })
    expect(wrapper.find('.goal-card').classes()).toContain('size-xl')
  })

  it('should use no box-shadow when flat is true', () => {
    const wrapper = mount(GoalCard, { props: { title: 'Goal', idx: 0, flat: true } })
    expect(wrapper.find('.goal-card').classes()).toContain('flat')
  })

  it('should set transition to none while dragging', () => {
    const wrapper = mount(GoalCard, { props: { title: 'Goal', idx: 0, dragging: true } })
    expect(wrapper.find('.goal-card').classes()).toContain('dragging')
  })
})

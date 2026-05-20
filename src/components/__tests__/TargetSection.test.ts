import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TargetSection from '@/components/TargetSection.vue'

describe('TargetSection', () => {
  it('should display the current target as the big number', () => {
    const wrapper = mount(TargetSection, { props: { target: 3, max: 5 } })
    expect(wrapper.find('.big-number').text()).toBe('3')
  })

  it('should show singular "goal" label when target is 1', () => {
    const wrapper = mount(TargetSection, { props: { target: 1, max: 5 } })
    expect(wrapper.find('.label').text()).toBe('final goal')
  })

  it('should show plural "goals" label when target is greater than 1', () => {
    const wrapper = mount(TargetSection, { props: { target: 2, max: 5 } })
    expect(wrapper.find('.label').text()).toBe('final goals')
  })

  it('should render a dot button for each number from 1 to max', () => {
    const wrapper = mount(TargetSection, { props: { target: 1, max: 5 } })
    expect(wrapper.findAll('.dot')).toHaveLength(5)
  })

  it('should mark the active dot with dot--selected class', () => {
    const wrapper = mount(TargetSection, { props: { target: 3, max: 5 } })
    const dots = wrapper.findAll('.dot')
    expect(dots[2]!.classes()).toContain('dot--selected')
    expect(dots[0]!.classes()).not.toContain('dot--selected')
  })

  it('should set aria-pressed to true only on the selected dot', () => {
    const wrapper = mount(TargetSection, { props: { target: 2, max: 4 } })
    const dots = wrapper.findAll('.dot')
    expect(dots[1]!.attributes('aria-pressed')).toBe('true')
    expect(dots[0]!.attributes('aria-pressed')).toBe('false')
  })

  it('should emit update:target with the clicked number', async () => {
    const wrapper = mount(TargetSection, { props: { target: 1, max: 5 } })
    await wrapper.findAll('.dot')[3]!.trigger('click')
    expect(wrapper.emitted('update:target')).toEqual([[4]])
  })

  it('should display the correct number inside each dot', () => {
    const wrapper = mount(TargetSection, { props: { target: 1, max: 3 } })
    const dots = wrapper.findAll('.dot')
    expect(dots[0]!.text()).toBe('1')
    expect(dots[1]!.text()).toBe('2')
    expect(dots[2]!.text()).toBe('3')
  })

  it('should set correct aria-label on each dot', () => {
    const wrapper = mount(TargetSection, { props: { target: 1, max: 2 } })
    const dots = wrapper.findAll('.dot')
    expect(dots[0]!.attributes('aria-label')).toBe('1 goal')
    expect(dots[1]!.attributes('aria-label')).toBe('2 goals')
  })
})

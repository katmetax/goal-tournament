import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ModeCard from '@/components/ModeCard.vue'

const mode = {
  label: 'Quick',
  title: 'Speed Run',
  subtitle: 'Pick your top goal fast',
  preview: ['Exercise', 'Reading', 'Travel'],
}

describe('ModeCard', () => {
  it('should render the mode label', () => {
    const wrapper = mount(ModeCard, { props: { idx: 0, mode } })
    expect(wrapper.find('.label-chip').text()).toBe('Quick')
  })

  it('should render the mode title', () => {
    const wrapper = mount(ModeCard, { props: { idx: 0, mode } })
    expect(wrapper.find('.title').text()).toBe('Speed Run')
  })

  it('should render the mode subtitle', () => {
    const wrapper = mount(ModeCard, { props: { idx: 0, mode } })
    expect(wrapper.find('.subtitle').text()).toBe('Pick your top goal fast')
  })

  it('should render all preview chips', () => {
    const wrapper = mount(ModeCard, { props: { idx: 0, mode } })
    const chips = wrapper.findAll('.preview-chip')
    expect(chips).toHaveLength(3)
    expect(chips[0]!.text()).toBe('Exercise')
    expect(chips[1]!.text()).toBe('Reading')
    expect(chips[2]!.text()).toBe('Travel')
  })

  it('should emit click when the card is clicked', async () => {
    const wrapper = mount(ModeCard, { props: { idx: 0, mode } })
    await wrapper.find('button.mode-card').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('should render as a button element', () => {
    const wrapper = mount(ModeCard, { props: { idx: 0, mode } })
    expect(wrapper.find('button.mode-card').exists()).toBe(true)
  })
})

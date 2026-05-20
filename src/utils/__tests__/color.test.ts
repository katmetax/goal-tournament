import { describe, it, expect } from 'vitest'
import { colorForCard } from '@/utils/color'
import { RAINBOW } from '@/data/colors'

describe('colorForCard', () => {
  it('should return the first color for index 0', () => {
    expect(colorForCard(0)).toEqual(RAINBOW[0])
  })

  it('should return the correct color for a mid-range index', () => {
    expect(colorForCard(3)).toEqual(RAINBOW[3])
  })

  it('should return the last color for the final index', () => {
    expect(colorForCard(RAINBOW.length - 1)).toEqual(RAINBOW[RAINBOW.length - 1])
  })

  it('should wrap around when index equals array length', () => {
    expect(colorForCard(RAINBOW.length)).toEqual(RAINBOW[0])
  })

  it('should wrap around for large indices', () => {
    expect(colorForCard(RAINBOW.length * 3 + 2)).toEqual(RAINBOW[2])
  })

  it('should wrap correctly for negative indices', () => {
    expect(colorForCard(-1)).toEqual(RAINBOW[RAINBOW.length - 1])
  })

  it('should wrap correctly for large negative indices', () => {
    expect(colorForCard(-RAINBOW.length - 1)).toEqual(RAINBOW[RAINBOW.length - 1])
  })
})

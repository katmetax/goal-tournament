import { describe, it, expect } from 'vitest'
import { parseGoals } from '@/utils/goals'

describe('parseGoals', () => {
  it('should parse comma-separated goals', () => {
    expect(parseGoals('Run a marathon, Learn piano, Write a book')).toEqual([
      'Run a marathon',
      'Learn piano',
      'Write a book',
    ])
  })

  it('should parse newline-separated goals', () => {
    expect(parseGoals('Run a marathon\nLearn piano\nWrite a book')).toEqual([
      'Run a marathon',
      'Learn piano',
      'Write a book',
    ])
  })

  it('should parse mixed comma and newline separators', () => {
    expect(parseGoals('Run a marathon\nLearn piano, Write a book')).toEqual([
      'Run a marathon',
      'Learn piano',
      'Write a book',
    ])
  })

  it('should trim whitespace from each goal', () => {
    expect(parseGoals('  Run a marathon  ,  Learn piano  ')).toEqual([
      'Run a marathon',
      'Learn piano',
    ])
  })

  it('should filter out empty entries from consecutive delimiters', () => {
    expect(parseGoals('Run a marathon,,Learn piano')).toEqual(['Run a marathon', 'Learn piano'])
  })

  it('should filter out whitespace-only entries', () => {
    expect(parseGoals('Run a marathon,   ,Learn piano')).toEqual(['Run a marathon', 'Learn piano'])
  })

  it('should return an empty array for an empty string', () => {
    expect(parseGoals('')).toEqual([])
  })

  it('should return an empty array for whitespace-only input', () => {
    expect(parseGoals('   \n  ')).toEqual([])
  })

  it('should handle a single goal with no delimiters', () => {
    expect(parseGoals('Run a marathon')).toEqual(['Run a marathon'])
  })

  it('should handle trailing and leading delimiters', () => {
    expect(parseGoals(',Run a marathon,Learn piano,')).toEqual(['Run a marathon', 'Learn piano'])
  })
})

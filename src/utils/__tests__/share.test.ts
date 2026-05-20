import { describe, it, expect } from 'vitest'
import { encodeShareToken, decodeShareToken } from '@/utils/share'

describe('encodeShareToken / decodeShareToken', () => {
  it('should round-trip a list of winners', () => {
    const winners = ['Run a marathon', 'Learn piano', 'Write a book']
    expect(decodeShareToken(encodeShareToken(winners))).toEqual(winners)
  })

  it('should round-trip an empty array', () => {
    expect(decodeShareToken(encodeShareToken([]))).toEqual([])
  })

  it('should round-trip winners with special characters', () => {
    const winners = ['Café & brunch', 'Learn 日本語', '50% done!']
    expect(decodeShareToken(encodeShareToken(winners))).toEqual(winners)
  })

  it('should round-trip a single winner', () => {
    const winners = ['Only goal']
    expect(decodeShareToken(encodeShareToken(winners))).toEqual(winners)
  })
})

describe('decodeShareToken', () => {
  it('should return null for an empty string', () => {
    expect(decodeShareToken('')).toBeNull()
  })

  it('should return null for invalid base64', () => {
    expect(decodeShareToken('not-valid-base64!!!')).toBeNull()
  })

  it('should return null for valid base64 that is not JSON', () => {
    const token = btoa('hello world')
    expect(decodeShareToken(token)).toBeNull()
  })

  it('should return null when JSON has no w property', () => {
    const token = btoa(JSON.stringify({ x: ['goal'] }))
    expect(decodeShareToken(token)).toBeNull()
  })

  it('should return null when w is not an array', () => {
    const token = btoa(JSON.stringify({ w: 'not an array' }))
    expect(decodeShareToken(token)).toBeNull()
  })
})

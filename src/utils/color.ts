import { RAINBOW } from '@/data/colors'

export function colorForCard(idx: number): CardColor {
  return RAINBOW[((idx % RAINBOW.length) + RAINBOW.length) % RAINBOW.length]!
}

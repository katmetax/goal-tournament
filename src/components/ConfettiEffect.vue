<script setup lang="ts">
import { RAINBOW } from '@/data/colors'

interface Piece {
  left: number
  cx: number
  cr: number
  delay: number
  duration: number
  size: number
  bg: string
  shape: 'rect' | 'circle'
  rot: number
}

const COUNT = 80

const pieces: Piece[] = Array.from({ length: COUNT }, (_, i) => {
  const c = RAINBOW[i % RAINBOW.length] ?? RAINBOW[0]!
  return {
    left: Math.random() * 100,
    cx: (Math.random() - 0.5) * 200,
    cr: 360 + Math.random() * 720,
    delay: Math.random() * 2.4,
    duration: 3.5 + Math.random() * 3.5,
    size: 6 + Math.random() * 10,
    bg: c.bg,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
    rot: Math.random() * 360,
  }
})
</script>

<template>
  <div class="confetti" aria-hidden="true">
    <div
      v-for="(p, i) in pieces"
      :key="i"
      class="piece"
      :style="{
        left: `${p.left}%`,
        top: '-10vh',
        width: `${p.size}px`,
        height: `${p.size}px`,
        '--cx': `${p.cx}px`,
        '--cr': `${p.cr}deg`,
        animationDuration: `${p.duration}s`,
        animationDelay: `${p.delay}s`,
      }"
    >
      <div
        v-if="p.shape === 'rect'"
        :style="{
          width: '100%',
          height: '60%',
          background: p.bg,
          transform: `rotate(${p.rot}deg)`,
          borderRadius: '1px',
        }"
      />
      <div
        v-else
        :style="{ width: '100%', height: '100%', background: p.bg, borderRadius: '50%' }"
      />
    </div>
  </div>
</template>

<style scoped>
.confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.piece {
  position: absolute;
  animation: confetti-fall linear forwards;
}
</style>

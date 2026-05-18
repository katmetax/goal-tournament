<script setup lang="ts">
import { computed } from 'vue'
import { colorForCard } from '@/utils/color'

interface Stamp {
  kind: 'keep' | 'pass'
  opacity: number
}

interface Props {
  title: string
  idx: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  flat?: boolean
  stamp?: Stamp | null
  rotation?: number
  dragX?: number
  dragY?: number
  dragging?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  flat: false,
  stamp: null,
  rotation: 0,
  dragX: 0,
  dragY: 0,
  dragging: false,
})

const SIZES = {
  sm: { w: 200, h: 130, font: 22, pad: 18 },
  md: { w: 300, h: 200, font: 28, pad: 22 },
  lg: { w: 360, h: 260, font: 36, pad: 28 },
  xl: { w: 420, h: 540, font: 52, pad: 36 },
}

const sz = computed(() => SIZES[props.size])
const color = computed(() => colorForCard(props.idx))

const cardStyle = computed(() => ({
  width: `${sz.value.w}px`,
  height: `${sz.value.h}px`,
  borderRadius: 'var(--card-radius)',
  padding: `${sz.value.pad}px`,
  background: color.value.bg,
  color: color.value.ink,
  boxShadow: props.flat ? 'none' : 'var(--card-shadow)',
  backgroundImage:
    'radial-gradient(circle at 100% 0%, rgba(255,255,255,.4), transparent 40%), radial-gradient(circle at 0% 100%, rgba(0,0,0,.05), transparent 40%)',
  position: 'relative' as const,
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'flex-end',
  fontFamily: 'var(--font-display)',
  fontSize: `${sz.value.font}px`,
  fontWeight: '600',
  lineHeight: '1.05',
  letterSpacing: '-0.01em',
  textWrap: 'balance',
  transform: `translate(${props.dragX}px, ${props.dragY}px) rotate(${props.rotation}deg)`,
  transition: props.dragging ? 'none' : 'transform .3s cubic-bezier(.2,.7,.2,1.2), box-shadow .2s',
  userSelect: 'none' as const,
  overflow: 'hidden',
}))

const stampStyle = computed(() => {
  if (!props.stamp) return null
  const isKeep = props.stamp.kind === 'keep'
  const color = isKeep ? 'var(--keep)' : 'var(--pass)'
  return {
    position: 'absolute' as const,
    ...(isKeep ? { top: '28px', left: '24px' } : { top: '28px', right: '24px' }),
    transform: `rotate(${isKeep ? -18 : 18}deg)`,
    border: `4px solid ${color}`,
    color,
    padding: '6px 18px',
    fontFamily: 'var(--font-mono)',
    fontSize: '28px',
    fontWeight: '800',
    letterSpacing: '0.12em',
    borderRadius: '6px',
    opacity: props.stamp.opacity,
    pointerEvents: 'none' as const,
    background: 'rgba(255,255,255,.15)',
    zIndex: 3,
  }
})
</script>

<template>
  <div class="goal-card" :style="cardStyle">
    <div class="card-index">nº{{ String(idx + 1).padStart(2, '0') }}</div>
    <div class="card-title">{{ title }}</div>
    <div v-if="stamp" :style="stampStyle">{{ stamp.kind === 'keep' ? 'KEEP' : 'PASS' }}</div>
  </div>
</template>

<style scoped>
.goal-card {
  position: relative;
}

.card-index {
  position: absolute;
  top: v-bind("sz.pad + 'px'");
  left: v-bind("sz.pad + 'px'");
  font-family: var(--font-mono);
  font-size: 11px;
  opacity: 0.55;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.card-title {
  position: relative;
  z-index: 1;
}
</style>

<script setup lang="ts">
defineProps<{
  eyebrow: string
  stackCenterOnMobile?: boolean
  centered?: boolean
  stackRightOnMobile?: boolean
}>()
</script>

<template>
  <div
    class="top-bar"
    :class="{
      'stack-mobile': stackCenterOnMobile,
      centered,
      'stack-right-mobile': stackRightOnMobile,
    }"
  >
    <span class="eyebrow">{{ eyebrow }}</span>
    <div class="center-slot"><slot name="center" /></div>
    <div class="right"><slot name="right" /></div>
  </div>
</template>

<style scoped>
.top-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  width: 100%;
  min-height: 36px;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--ink-soft);
  text-transform: uppercase;
  padding-left: 90px;
}

.center-slot {
  display: flex;
  justify-content: center;
}

.right {
  display: flex;
  justify-content: flex-end;
}

.centered {
  grid-template-columns: 1fr;
}

.centered .eyebrow {
  padding-left: 0;
  text-align: center;
}

.centered .center-slot,
.centered .right {
  display: none;
}

@media (max-width: 480px) {
  .eyebrow {
    padding-left: 52px;
  }

  .stack-right-mobile {
    grid-template-columns: 1fr auto 1fr;
    grid-template-areas:
      '. eyebrow .'
      'right right right';
    gap: 10px 8px;
  }

  .stack-right-mobile .eyebrow {
    grid-area: eyebrow;
    padding-left: 0;
    text-align: center;
  }

  .stack-right-mobile .right {
    grid-area: right;
    justify-content: center;
  }

  .stack-mobile {
    grid-template-columns: 1fr auto 1fr;
    grid-template-areas:
      '. eyebrow right'
      'center center center';
    gap: 10px 8px;
  }

  .stack-mobile .eyebrow {
    grid-area: eyebrow;
    padding-left: 0;
    text-align: center;
  }

  .stack-mobile .center-slot {
    grid-area: center;
    justify-self: center;
  }

  .stack-mobile .right {
    grid-area: right;
  }
}
</style>
